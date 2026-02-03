const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection and checking for tables...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database');

    // Check tables
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n📊 Tables found: ${result.rows.length}`);

    if (result.rows.length === 0) {
      console.log('❌ No tables found - you need to run the setup script');
      console.log('💡 Run: node setupDatabase.js');
    } else {
      console.log('✅ Tables exist:');
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    client.release();

  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
