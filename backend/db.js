import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Test conection

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error connecting to database:", err.stack);
  }
  console.log("✅ Connected to PostgreSQL database");
  release();
});
