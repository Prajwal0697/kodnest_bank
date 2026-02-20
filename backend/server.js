require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { pool, initDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "kodbank_super_secret";

// ─── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // allow cookies cross-origin
  })
);

// ─── Auth Middleware ─────────────────────────────────────────
const authenticate = async (req, res, next) => {
  const token = req.cookies.kodbank_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify token exists in DB and is not expired
    const result = await pool.query(
      `SELECT * FROM BankUserJwt WHERE tokenvalue = $1 AND Cid = $2 AND exp > NOW()`,
      [token, decoded.cid]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Token invalid or expired" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ─── Routes ──────────────────────────────────────────────────

// REGISTER
app.post("/api/register", async (req, res) => {
  console.log("📝 Register request received:", req.body);
  const { cname, cpwd, email, initialBalance = 0 } = req.body;

  if (!cname || !cpwd || !email)
    return res.status(400).json({ error: "All fields required" });

  try {
    const hashedPwd = await bcrypt.hash(cpwd, 10);
    const result = await pool.query(
      `INSERT INTO BankUser (Cname, Cpwd, balance, email) VALUES ($1, $2, $3, $4) RETURNING Cid, Cname, email, balance`,
      [cname, hashedPwd, initialBalance, email]
    );
    res.status(201).json({ message: "Registered successfully", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "Email already registered" });
    res.status(500).json({ error: "Registration failed", detail: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, cpwd } = req.body;

  if (!email || !cpwd)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const result = await pool.query(`SELECT * FROM BankUser WHERE email = $1`, [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(cpwd, user.cpwd);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const expiresIn = "1h";
    const token = jwt.sign({ cid: user.cid, cname: user.cname, email: user.email }, JWT_SECRET, {
      expiresIn,
    });

    const expTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in BankUserJwt table
    await pool.query(
      `INSERT INTO BankUserJwt (tokenvalue, Cid, exp) VALUES ($1, $2, $3)`,
      [token, user.cid, expTime]
    );

    // Set as HttpOnly cookie
    res.cookie("kodbank_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      message: "Login successful",
      user: { cid: user.cid, cname: user.cname, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
});

// LOGOUT
app.post("/api/logout", authenticate, async (req, res) => {
  const token = req.cookies.kodbank_token;
  try {
    await pool.query(`DELETE FROM BankUserJwt WHERE tokenvalue = $1`, [token]);
    res.clearCookie("kodbank_token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
});

// CHECK BALANCE
app.get("/api/balance", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT Cid, Cname, email, balance FROM BankUser WHERE Cid = $1`,
      [req.user.cid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch balance" });
  }
});

// TRANSFER MONEY
app.post("/api/transfer", authenticate, async (req, res) => {
  const { toEmail, amount } = req.body;

  if (!toEmail || !amount || amount <= 0)
    return res.status(400).json({ error: "Invalid transfer details" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get sender
    const senderResult = await client.query(
      `SELECT * FROM BankUser WHERE Cid = $1 FOR UPDATE`,
      [req.user.cid]
    );
    const sender = senderResult.rows[0];

    if (sender.email === toEmail)
      return res.status(400).json({ error: "Cannot transfer to yourself" });

    if (parseFloat(sender.balance) < parseFloat(amount))
      return res.status(400).json({ error: "Insufficient balance" });

    // Get receiver
    const receiverResult = await client.query(
      `SELECT * FROM BankUser WHERE email = $1 FOR UPDATE`,
      [toEmail]
    );
    if (receiverResult.rows.length === 0)
      return res.status(404).json({ error: "Recipient not found" });

    const receiver = receiverResult.rows[0];

    // Deduct from sender
    await client.query(
      `UPDATE BankUser SET balance = balance - $1 WHERE Cid = $2`,
      [amount, sender.cid]
    );

    // Add to receiver
    await client.query(
      `UPDATE BankUser SET balance = balance + $1 WHERE Cid = $2`,
      [amount, receiver.cid]
    );

    await client.query("COMMIT");

    // Return updated sender balance
    const updatedSender = await pool.query(
      `SELECT balance FROM BankUser WHERE Cid = $1`,
      [req.user.cid]
    );

    res.json({
      message: `Successfully transferred ₹${amount} to ${receiver.cname}`,
      newBalance: updatedSender.rows[0].balance,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Transfer failed", detail: err.message });
  } finally {
    client.release();
  }
});

// GET CURRENT USER (check if logged in)
app.get("/api/me", authenticate, async (req, res) => {
  res.json({ cid: req.user.cid, cname: req.user.cname, email: req.user.email });
});

// GET DB SNAPSHOT (for simulation visualization)
app.get("/api/snapshot", authenticate, async (req, res) => {
  try {
    const users = await pool.query("SELECT Cid, Cname, balance, email FROM BankUser ORDER BY Cid");
    const tokens = await pool.query("SELECT tokenid, tokenvalue, Cid, exp FROM BankUserJwt ORDER BY tokenid DESC");
    res.json({ users: users.rows, tokens: tokens.rows });
  } catch (err) {
    res.status(500).json({ error: "Snapshot failed" });
  }
});

// ─── Start Server ────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => console.log(`🏦 KodBank server running on port ${PORT}`));
});
