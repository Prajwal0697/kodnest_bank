const { Client } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        await client.connect();
        console.log("Connected successfully");
        const res = await client.query('SELECT NOW()');
        console.log("Time from DB:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection error:", err);
    }
}

test();
