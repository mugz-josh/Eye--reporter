require('dotenv').config();
const { Pool } = require('pg');

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com',
    user: process.env.DB_USER || 'ireporter_user',
    password: process.env.DB_PASSWORD || 'oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e',
    database: process.env.DB_NAME || 'ireporter_joshua',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connected to database');

    // Create comments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        report_type TEXT CHECK (report_type IN ('red_flag', 'intervention')) NOT NULL,
        report_id INTEGER NOT NULL,
        comment_text TEXT NOT NULL,
        comment_type TEXT CHECK (comment_type IN ('user', 'admin', 'official')) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Comments table created/verified');

    // Create upvotes table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS upvotes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        report_type TEXT CHECK (report_type IN ('red_flag', 'intervention')) NOT NULL,
        report_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, report_type, report_id)
      )
    `);
    console.log('✅ Upvotes table created/verified');

    // Check if tables exist
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('Available tables:', result.rows.map(row => row.table_name));

  } catch (err) {
    console.error('Database setup error:', err);
  } finally {
    await pool.end();
    console.log('Database connection closed');
  }
}

setupDatabase();
