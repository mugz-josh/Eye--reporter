import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com',
  user: process.env.DB_USER || 'ireporter_user',
  password: process.env.DB_PASSWORD || 'oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e',
  database: process.env.DB_NAME || 'ireporter_joshua',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database via connection pool");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL database:", err);
  }
};

testConnection();

export default pool;
