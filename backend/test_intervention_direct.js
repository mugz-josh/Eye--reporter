const { Pool } = require('pg');

async function testInterventionCreation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Testing intervention creation...');

    // First, get a user ID to use for the test
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log(`Using user ID: ${userId}`);

    // Test the exact query used in the controller
    const query = `
      INSERT INTO interventions (user_id, title, description, latitude, longitude, images, videos)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      userId,
      'Test Intervention',
      'This is a test intervention',
      40.7128,
      -74.0060,
      null, // images
      null  // videos
    ];

    console.log('Executing query with values:', values);

    const result = await pool.query(query, values);

    console.log('✅ Intervention created successfully with ID:', result.rows[0].id);

  } catch (err) {
    console.error('❌ Error creating intervention:', err);
    console.error('Error details:', err.message);
    console.error('Error code:', err.code);
  } finally {
    await pool.end();
  }
}

testInterventionCreation();
