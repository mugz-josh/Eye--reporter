const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testPasswords() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ireporter'
  });

  try {
    const [rows] = await pool.execute('SELECT email, password FROM users');
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
