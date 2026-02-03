const pool = require('./config/database');

(async () => {
  try {
    const result = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'interventions' AND table_schema = 'public' ORDER BY ordinal_position`);
    console.log('Interventions table columns:');
    result.rows.forEach(col => console.log('  - ' + col.column_name));

    const hasImages = result.rows.some(col => col.column_name === 'images');
    const hasVideos = result.rows.some(col => col.column_name === 'videos');
    console.log('Has images column:', hasImages);
    console.log('Has videos column:', hasVideos);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
})();
