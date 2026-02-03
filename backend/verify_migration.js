const { Pool } = require('pg');

async function verifyMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Verifying migration...');

    // Check interventions table columns
    const result = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'interventions' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log('Interventions table columns:');
    result.rows.forEach(col => console.log(`  - ${col.column_name}`));

    const hasImages = result.rows.some(col => col.column_name === 'images');
    const hasVideos = result.rows.some(col => col.column_name === 'videos');

    if (hasImages && hasVideos) {
      console.log('✅ Migration successful: images and videos columns exist');
    } else {
      console.log('❌ Migration failed: missing columns');
    }

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await pool.end();
  }
}

verifyMigration();
