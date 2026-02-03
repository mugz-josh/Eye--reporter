const { Pool } = require('pg');

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 Checking PostgreSQL database tables...\n');

    // Check if tables exist
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (result.rows.length === 0) {
      console.log('❌ No tables found in the database.');
      console.log('📝 You need to run the setup script to create tables.');
    } else {
      console.log('✅ Tables found in database:');
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      console.log(`\n📊 Total tables: ${result.rows.length}`);
    }

  } catch (err) {
    console.error('❌ Error checking tables:', err.message);
  } finally {
    await pool.end();
  }
}

checkTables();
