import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Adjust based on load
  queueLimit: 0,        // 0 = no limit
});

// Optional: verify connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL database:", err);
  } else {
    console.log("✅ Connected to MySQL database via connection pool");
    connection.release(); // Always release connection back to pool
  }
});

export default pool;
