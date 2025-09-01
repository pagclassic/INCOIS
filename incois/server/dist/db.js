"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
async function query(text, params) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return { rows: res.rows };
    }
    finally {
        client.release();
    }
}
