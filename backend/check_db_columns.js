const { Pool } = require('pg');

async function checkColumns() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Checking interventions table columns...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'interventions' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log('Interventions table columns:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });

    const hasImages = result.rows.some(col => col.column_name === 'images');
    const hasVideos = result.rows.some(col => col.column_name === 'videos');

    console.log(`\nMigration status:`);
    console.log(`  - Images column: ${hasImages ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  - Videos column: ${hasVideos ? '✅ EXISTS' : '❌ MISSING'}`);

  } catch (err) {
    console.error('Error checking columns:', err);
  } finally {
    await pool.end();
  }
}

checkColumns();
