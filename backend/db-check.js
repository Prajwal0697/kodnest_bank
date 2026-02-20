const { pool } = require('./db');

async function check() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in DB:", res.rows.map(r => r.table_name));

        const userCount = await pool.query("SELECT COUNT(*) FROM BankUser");
        console.log("User count:", userCount.rows[0].count);

        process.exit(0);
    } catch (err) {
        console.error("Diagnostic failed:", err);
        process.exit(1);
    }
}

check();
