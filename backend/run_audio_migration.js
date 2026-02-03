const { Pool } = require('pg');

async function runAudioMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com',
    user: process.env.DB_USER || 'ireporter_user',
    password: process.env.DB_PASSWORD || 'oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e',
    database: process.env.DB_NAME || 'ireporter_joshua',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('✅ Connected to database');

    // Add audio column to red_flags table if it doesn't exist
    await pool.query(`
      ALTER TABLE red_flags
      ADD COLUMN IF NOT EXISTS audio JSONB
    `);
    console.log('✅ Added audio column to red_flags table');

    // Add audio column to interventions table if it doesn't exist
    await pool.query(`
      ALTER TABLE interventions
      ADD COLUMN IF NOT EXISTS audio JSONB
    `);
    console.log('✅ Added audio column to interventions table');

    // Verify columns were added
    const redFlagsResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'red_flags' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    const interventionsResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'interventions' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Red flags table columns:');
    redFlagsResult.rows.forEach(col => console.log(`  - ${col.column_name}`));

    console.log('\n📋 Interventions table columns:');
    interventionsResult.rows.forEach(col => console.log(`  - ${col.column_name}`));

    console.log('\n🎉 Audio migration completed successfully!');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
runAudioMigration().catch(console.error);
