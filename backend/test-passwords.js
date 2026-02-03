const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function testPasswords() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com',
    user: process.env.DB_USER || 'ireporter_user',
    password: process.env.DB_PASSWORD || 'oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e',
    database: process.env.DB_NAME || 'ireporter_joshua',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT email, password FROM users');
    const rows = result.rows;
    console.log('Password verification:');
    for (const row of rows) {
      const isValidAdmin = await bcrypt.compare('admin123', row.password);
      const isValidTest = await bcrypt.compare('test123', row.password);
      console.log(`${row.email}: admin123=${isValidAdmin}, test123=${isValidTest}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testPasswords();
