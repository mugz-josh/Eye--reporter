const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
  ssl: { rejectUnauthorized: false }
});

async function verifyTables() {
  try {
    console.log('🔍 Checking if tables exist in PostgreSQL database...');

    const tables = ['users', 'red_flags', 'interventions', 'comments', 'upvotes', 'follows', 'notifications'];

    for (const table of tables) {
      try {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = $1
          )
        `, [table]);

        const exists = result.rows[0].exists;
        console.log(`${exists ? '✅' : '❌'} Table "${table}" ${exists ? 'exists' : 'does not exist'}`);
      } catch (err) {
        console.log(`❌ Error checking table "${table}":`, err.message);
      }
    }

    console.log('🎉 Table verification completed!');

  } catch (err) {
    console.error('❌ Database verification failed:', err);
  } finally {
    await pool.end();
  }
}

verifyTables();
