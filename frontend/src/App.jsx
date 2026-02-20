import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  VscCreditCard,
  VscSend,
  VscHistory,
  VscAccount,
  VscLock,
  VscSignOut,
  VscDatabase,
  VscPulse,
  VscShield,
  VscRefresh,
  VscReplace,
  VscTerminal
} from "react-icons/vsc";
import {
  MdAccountBalance,
  MdSecurity,
  MdUpdate,
  MdReceipt
} from "react-icons/md";


// ─── Axios default setup ──────────────────────────────────────
axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});


// ─── Styles ───────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "transparent",
    color: "#f8fafc",
    fontFamily: "'Outfit', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflowX: "hidden",
  },
  meshGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#020617", // Base color
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0, transparent 50%),
      radial-gradient(at 50% 0%, rgba(2, 132, 199, 0.1) 0, transparent 50%),
      radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.15) 0, transparent 50%),
      radial-gradient(at 50% 100%, rgba(15, 23, 42, 1) 0, transparent 100%)
    `,
    zIndex: -2,
  },
  floatingOrb: (color, size, top, left, delay) => ({
    position: "fixed",
    width: size,
    height: size,
    background: color,
    top,
    left,
    filter: "blur(80px)",
    borderRadius: "50%",
    opacity: 0.3,
    zIndex: -1,
    animation: `float 20s infinite alternate cubic-bezier(0.45, 0, 0.55, 1) ${delay}`,
  }),
  glow: {
    textShadow: "0 0 30px rgba(56, 189, 248, 0.6)",
  },
  header: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(25px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoIcon: {
    background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
    padding: "10px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(56, 189, 248, 0.3)",
  },
  main: {
    width: "100%",
    maxWidth: "1200px",
    padding: "60px 24px",
    boxSizing: "border-box",
    position: "relative",
  },
  card: {
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(40px) saturate(200%)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "32px",
    padding: "40px",
    marginBottom: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border 0.3s ease",
    position: "relative",
    cursor: "default",
  },
  cardHover: {
    "&:hover": {
      transform: "translateY(-5px)",
      borderColor: "rgba(56, 189, 248, 0.3)",
    }
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#38bdf8",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
  },
  inputGroup: {
    position: "relative",
    marginBottom: "20px",
  },
  inputIcon: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: "18px",
    transition: "color 0.3s ease",
  },
  input: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    paddingTop: "18px",
    paddingRight: "20px",
    paddingBottom: "18px",
    paddingLeft: "64px",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  btn: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: "700",
    padding: "16px 32px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)",
  },
  btnDanger: {
    background: "rgba(244, 63, 94, 0.05)",
    borderColor: "rgba(244, 63, 94, 0.1)",
    color: "#f43f5e",
    fontSize: "14px",
    fontWeight: "600",
  },
  alert: (type) => ({
    padding: "20px",
    borderRadius: "24px",
    marginBottom: "32px",
    fontSize: "14px",
    fontWeight: "600",
    background: type === "error" ? "rgba(244, 63, 94, 0.05)" : "rgba(16, 185, 129, 0.05)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${type === "error" ? "rgba(244, 63, 94, 0.1)" : "rgba(16, 185, 129, 0.1)"}`,
    color: type === "error" ? "#fb7185" : "#34d399",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  }),
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
    background: "rgba(15, 23, 42, 0.4)",
    padding: "8px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  tab: (active) => ({
    flex: 1,
    padding: "14px",
    background: active ? "rgba(255, 255, 255, 0.05)" : "transparent",
    border: active ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
    borderRadius: "18px",
    color: active ? "#fff" : "#64748b",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "center",
  }),
  balanceBox: {
    textAlign: "center",
    padding: "80px 40px",
    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
    borderRadius: "48px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "48px",
    position: "relative",
    overflow: "hidden",
  },
  balanceLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "700",
    letterSpacing: "3px",
    marginBottom: "24px",
    textTransform: "uppercase",
  },
  balanceAmount: {
    fontSize: "88px",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "-4px",
    lineHeight: "1",
    background: "linear-gradient(to bottom, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tableWrapper: {
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.03)",
    background: "rgba(15, 23, 42, 0.2)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
  },
  th: {
    background: "rgba(15, 23, 42, 0.4)",
    padding: "20px 24px",
    textAlign: "left",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  td: {
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "500",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(56, 189, 248, 0.08)",
    borderRadius: "12px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#38bdf8",
  },
};

// ─── Shared Components ────────────────────────────────────────
const BackgroundMesh = () => (
  <>
    <div style={styles.meshGradient} />
    <div style={styles.floatingOrb("linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)", "500px", "-100px", "-100px", "0s")} />
    <div style={styles.floatingOrb("linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", "400px", "20%", "60%", "2s")} />
    <div style={styles.floatingOrb("linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", "300px", "80%", "10%", "5s")} />
  </>
);


// ─── Alert component ─────────────────────────────────────────
const Alert = ({ msg, type }) =>
  msg ? (
    <div style={styles.alert(type)}>
      {type === "error" ? <VscPulse size={16} /> : <VscShield size={16} />}
      {msg}
    </div>
  ) : null;

// ─── Auth Page ───────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ cname: "", email: "", cpwd: "", initialBalance: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await API.post("/login", { email: form.email, cpwd: form.cpwd });
        setMsg({ text: "LOGIN GRANTED. REDIRECTING...", type: "success" });
        setTimeout(() => onLogin(res.data.user), 800);
      } else {
        await API.post("/register", {
          cname: form.cname,
          email: form.email,
          cpwd: form.cpwd,
          initialBalance: parseFloat(form.initialBalance) || 0,
        });
        setMsg({ text: "ACCOUNT CREATED. PROCEED TO LOGIN.", type: "success" });
        setMode("login");
        setForm((f) => ({ ...f, cname: "", cpwd: "" }));
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.error || "ACCESS DENIED: SYSTEM ERROR", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <BackgroundMesh />
      <div style={styles.header}>
        <span style={styles.logo}>
          <div style={styles.logoIcon}>
            <VscTerminal size={24} color="#fff" />
          </div>
          🏦 KODBANK
        </span>
        <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", fontWeight: "500" }}>
          PROTOCOL_SECURE // v3.0.1
        </span>
      </div>
      <div style={{ ...styles.main, maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ fontSize: "52px", fontWeight: "900", color: "#fff", letterSpacing: "12px", ...styles.glow, lineHeight: "1" }}>🏦 KODBANK</div>
          <div style={{ fontSize: "14px", color: "#64748b", marginTop: "24px", letterSpacing: "8px", fontWeight: "700", textTransform: "uppercase" }}>
            The Future of Finance
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.tabs}>
            <button style={styles.tab(mode === "login")} onClick={() => setMode("login")}>
              LOGIN
            </button>
            <button
              style={styles.tab(mode === "register")}
              onClick={() => setMode("register")}
            >
              REGISTER
            </button>
          </div>

          <Alert msg={msg.text} type={msg.type} />

          {mode === "register" && (
            <div style={styles.inputGroup}>
              <VscAccount style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Preferred Username"
                value={form.cname}
                onChange={set("cname")}
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <VscDatabase style={styles.inputIcon} />
            <input
              style={styles.input}
              placeholder="Cloud Identifier (Email)"
              type="email"
              value={form.email}
              onChange={set("email")}
            />
          </div>
          <div style={styles.inputGroup}>
            <VscLock style={styles.inputIcon} />
            <input
              style={styles.input}
              placeholder="Security Key (Password)"
              type="password"
              value={form.cpwd}
              onChange={set("cpwd")}
            />
          </div>
          {mode === "register" && (
            <div style={styles.inputGroup}>
              <VscCreditCard style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Initial Assets (₹)"
                type="number"
                value={form.initialBalance}
                onChange={set("initialBalance")}
              />
            </div>
          )}

          <button
            style={{ ...styles.btn, ...styles.btnPrimary, width: "100%", marginTop: "12px", height: "60px" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <VscRefresh className="spin" size={24} /> : mode === "login" ? "ESTABLISH CONNECTION" : "GENERATE CRYPTO-CORE"}
          </button>
        </div>

        <div style={{ ...styles.card, padding: "24px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>
            ENCRYPTED WITH 2048-BIT SECURITY PROTOCOLS
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 
          from { transform: translate(0, 0) scale(1); } 
          to { transform: translate(30px, 30px) scale(1.1); } 
        }
        .spin { animation: spin 2s linear infinite; }
        body { margin: 0; padding: 0; background: #020617; }
      `}</style>
    </div>
  );
}


// ─── Dashboard ───────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("balance");
  const [balance, setBalance] = useState(null);
  const [snapshot, setSnapshot] = useState({ users: [], tokens: [] });
  const [transfer, setTransfer] = useState({ toEmail: "", amount: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] SESSION_INIT: ESTABLISHING SECURE HANDSHAKE...`,
    `[${new Date().toLocaleTimeString()}] AUTH_GRANTED: USER_ID_${user.cid}_CONNECTED`,
  ]);

  const addLog = (text) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev].slice(0, 10));
  };

  const fetchBalance = useCallback(async () => {
    try {
      const res = await API.get("/balance");
      setBalance(res.data);
      addLog("MEM_READ: ACCOUNT_BALANCE_SYNCED");
    } catch {
      setMsg({ text: "SYNC_ERROR: UNABLE TO FETCH BALANCE", type: "error" });
      addLog("ERR: BALANCE_SYNC_FAILED");
    }
  }, [user.cid]);

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await API.get("/snapshot");
      setSnapshot(res.data);
    } catch (err) {
      console.error("Snapshot error:", err);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 5000);
    return () => clearInterval(interval);
  }, [fetchBalance, fetchSnapshot]);

  const handleTransfer = async () => {
    if (!transfer.toEmail || !transfer.amount)
      return setMsg({ text: "INPUT_ERROR: MISSING TRANSFER DATA", type: "error" });

    addLog(`INIT_TX: ATTEMPT_TRANSFER_${transfer.amount}_TO_${transfer.toEmail}`);
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      const res = await API.post("/transfer", {
        toEmail: transfer.toEmail,
        amount: parseFloat(transfer.amount),
      });
      setMsg({ text: `SUCCESS: ${res.data.message.toUpperCase()}`, type: "success" });
      setBalance((b) => ({ ...b, balance: res.data.newBalance }));
      addLog(`TX_COMMIT: ATOMIC_OPERATION_SUCCESSFUL`);
      setTransfer({ toEmail: "", amount: "" });
      fetchSnapshot();
    } catch (err) {
      const errorMsg = err.response?.data?.error?.toUpperCase() || "TRANSACTION REJECTED";
      setMsg({ text: `FAILED: ${errorMsg}`, type: "error" });
      addLog(`TX_ROLLBACK: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    addLog("SHUTDOWN: TERMINATING_SESSION...");
    await API.post("/logout").catch(() => { });
    onLogout();
  };

  return (
    <div style={styles.root}>
      <BackgroundMesh />
      <div style={styles.header}>
        <span style={styles.logo}>
          <VscTerminal size={32} />
          🏦 KODBANK</span>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              👤 {user.cname.toUpperCase()}
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>CID-{user.cid}</span>
          </div>
          <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleLogout}>
            <VscSignOut size={16} /> LOGOUT
          </button>
        </div>
      </div>

      <div style={styles.main}>
        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(255,255,255,0.02)",
            padding: "12px 20px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <span style={{ ...styles.tag, color: "#10b981", borderColor: "rgba(16, 185, 129, 0.2)", background: "rgba(16, 185, 129, 0.1)" }}>
            ● ONLINE
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <VscShield size={14} /> JWT_SECURE
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <VscDatabase size={14} /> AIVEN_CLOUD
          </span>
        </div>

        {/* System Terminal Console */}
        <div style={{
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "16px",
          marginBottom: "32px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "11px",
          color: "#94a3b8",
          borderRadius: "16px",
          maxHeight: "120px",
          overflowY: "auto",
        }}>
          <div style={{ marginBottom: "8px", color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", fontWeight: "bold" }}>
            <VscPulse size={12} /> CONSOLE_STREAM
          </div>
          {logs.map((log, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.1, marginBottom: "4px" }}>{log}</div>
          ))}
        </div>

        {balance && (
          <div style={styles.balanceBox}>
            <div style={styles.balanceLabel}>
              <VscCreditCard size={14} /> CURRENT_BALANCE // AVAILABLE
            </div>
            <div style={{ ...styles.balanceAmount, ...styles.glow }}>
              ₹{parseFloat(balance.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.3)", marginTop: "16px", letterSpacing: "2px" }}>
              OWNER: {balance.email} // VERIFIED NODE
            </div>
          </div>
        )}

        <div style={styles.tabs}>
          <button style={styles.tab(tab === "balance")} onClick={() => { setTab("balance"); fetchBalance(); setMsg({ text: "", type: "" }); }}>
            [ ACCOUNT_OVERVIEW ]
          </button>
          <button style={{ ...styles.tab(tab === "transfer"), borderRight: "none" }} onClick={() => { setTab("transfer"); setMsg({ text: "", type: "" }); }}>
            [ FUND_TRANSFER ]
          </button>
        </div>

        <Alert msg={msg.text} type={msg.type} />

        {tab === "balance" && balance && (
          <div style={styles.card}>
            <div style={styles.cardTitle}><VscAccount size={16} /> ACCOUNT_METADATA</div>
            <table style={styles.table}>
              <tbody>
                {[
                  ["CID_IDENTIFIER", `#${balance.cid}`],
                  ["CLIENT_NAME", balance.cname.toUpperCase()],
                  ["CLIENT_EMAIL", balance.email],
                  ["CREDIT_VALUE", `₹${parseFloat(balance.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
                  ["SYNCCONFIG", "AIVEN_NODE_SECURE"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ ...styles.td, color: "#94a3b8", width: "180px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px" }}>{k}</td>
                    <td style={{ ...styles.td, fontWeight: "700", color: "#fff" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              style={{ ...styles.btn, marginTop: "24px", width: "100%" }}
              onClick={fetchBalance}
            >
              <VscRefresh size={14} /> REFRESH_DATA_NODE
            </button>
          </div>
        )}

        {tab === "transfer" && (
          <div style={styles.card}>
            <div style={styles.cardTitle}><VscReplace size={16} /> EXECUTE_TRANSFER</div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px" }}>TARGET_RECIPIENT_EMAIL</label>
              <div style={{ position: "relative", marginTop: "8px" }}>
                <VscAccount size={14} style={{ position: "absolute", left: "16px", top: "16px", opacity: 0.5 }} />
                <input
                  style={{ ...styles.input, paddingLeft: "44px", marginBottom: 0 }}
                  placeholder="RECIPIENT@HOST.NODE"
                  type="email"
                  value={transfer.toEmail}
                  onChange={(e) => setTransfer((t) => ({ ...t, toEmail: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px" }}>TRANSACTION_AMOUNT_(INR)</label>
              <div style={{ position: "relative", marginTop: "8px" }}>
                <VscCreditCard size={14} style={{ position: "absolute", left: "16px", top: "16px", opacity: 0.5 }} />
                <input
                  style={{ ...styles.input, paddingLeft: "44px", marginBottom: 0 }}
                  placeholder="0.00"
                  type="number"
                  value={transfer.amount}
                  onChange={(e) => setTransfer((t) => ({ ...t, amount: e.target.value }))}
                />
              </div>
            </div>

            {balance && transfer.amount && (
              <div style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "24px",
                padding: "20px",
                background: "rgba(14, 165, 233, 0.05)",
                borderRadius: "16px",
                border: "1px solid rgba(14, 165, 233, 0.1)"
              }}>
                <div style={{ marginBottom: "6px", fontWeight: "700", color: "#38bdf8" }}>CORE_PROJECTION:</div>
                <div style={{ color: "#e2e8f0" }}>
                  ESTIMATED_REMAINING: ₹
                  {Math.max(0, parseFloat(balance.balance) - parseFloat(transfer.amount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}

            <button
              style={{ ...styles.btn, ...styles.btnPrimary, width: "100%", height: "50px" }}
              onClick={handleTransfer}
              disabled={loading}
            >
              {loading ? <VscRefresh className="spin" size={18} /> : "CONFIRM_TRANSACTION //"}
            </button>
          </div>
        )}

        <div style={{ ...styles.card, padding: "24px" }}>
          <div style={styles.cardTitle}><VscDatabase size={16} /> LIVE_DB_SNAPSHOT // {new Date().toLocaleTimeString()}</div>
          <div style={styles.grid}>
            <div>
              <div style={{ color: "#64748b", marginBottom: "12px", letterSpacing: "2px", fontSize: "10px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
                <VscPulse size={12} /> TABLE: BANKUSER
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>CID</th>
                      <th style={styles.th}>NAME</th>
                      <th style={styles.th}>BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.users.map((u) => (
                      <tr key={u.cid} style={{ background: u.cid === user.cid ? "rgba(56,189,248,0.05)" : "transparent" }}>
                        <td style={styles.td}>{u.cid}</td>
                        <td style={styles.td}>{u.cname}</td>
                        <td style={styles.td}>₹{parseFloat(u.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div style={{ color: "#64748b", marginBottom: "12px", letterSpacing: "2px", fontSize: "10px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
                <VscPulse size={12} /> TABLE: BANKUSERJWT
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>TOKEN_Pfx</th>
                      <th style={styles.th}>CID</th>
                      <th style={styles.th}>EXPIRY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.tokens.map((t) => (
                      <tr key={t.tokenid}>
                        <td style={{ ...styles.td, fontSize: "12px", color: "#64748b" }}>{t.tokenvalue.substring(0, 8)}...</td>
                        <td style={styles.td}>{t.cid}</td>
                        <td style={styles.td}>{new Date(t.exp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "16px", textAlign: "right", color: "#334155", fontSize: "10px", fontWeight: "600" }}>
            POLLING_INTERVAL: 5000MS // SYSTEM_READY
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 
          from { transform: translate(0, 0) scale(1); } 
          to { transform: translate(30px, 30px) scale(1.1); } 
        }
        .spin { animation: spin 2s linear infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); borderRadius: 10px; }
        body { margin: 0; padding: 0; background: #020617; }
      `}</style>
    </div>
  );
}


// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    API.get("/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking)
    return (
      <div
        style={{
          ...styles.root,
          background: "#020617",
          justifyContent: "center",
          fontSize: "18px",
          color: "#fff",
        }}
      >
        <BackgroundMesh />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" }}>
          <VscRefresh className="spin" size={64} color="#38bdf8" />
          <div style={{ letterSpacing: "8px", fontWeight: "900", ...styles.glow }}>INITIALIZING KODBANK PROTOCOLS</div>
          <div style={{ color: "#64748b", fontSize: "14px", letterSpacing: "2px" }}>Establishing secure link to Aiven Cloud...</div>
        </div>
      </div>
    );

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <AuthPage onLogin={setUser} />
  );
}

