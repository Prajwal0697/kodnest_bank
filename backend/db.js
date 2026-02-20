const { Pool } = require("pg");
require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS BankUser (
      Cid SERIAL PRIMARY KEY,
      Cname VARCHAR(100) NOT NULL,
      Cpwd VARCHAR(255) NOT NULL,
      balance NUMERIC(15, 2) DEFAULT 0,
      email VARCHAR(150) UNIQUE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS BankUserJwt (
      tokenid SERIAL PRIMARY KEY,
      tokenvalue VARCHAR(512) NOT NULL,
      Cid INTEGER REFERENCES BankUser(Cid) ON DELETE CASCADE,
      exp TIMESTAMP NOT NULL
    );
  `);

  console.log("✅ Database tables initialized.");
};

module.exports = { pool, initDB };
