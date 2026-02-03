const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let pool;

  try {
    // Connect to PostgreSQL
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://ireporter_user:oRnHxJE58hx8z2xyZVuxRIILi4HOhN7e@dpg-d606jnffte5s73d97d10-a.oregon-postgres.render.com/ireporter_joshua',
      ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
      max: 5, // Reduce pool size
      idleTimeoutMillis: 60000, // Increase idle timeout
      connectionTimeoutMillis: 10000, // Increase connection timeout
    });

    console.log('✅ Connected to PostgreSQL server');

    // Test the connection
    const client = await pool.connect();
    console.log('✅ Database connection established');
    client.release();

    // Drop existing tables if they exist (to ensure clean setup)
    const tables = ['follows', 'upvotes', 'comments', 'notifications', 'interventions', 'red_flags', 'users'];
    for (const table of tables) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`✅ Dropped table "${table}" if it existed`);
      } catch (err) {
        console.log(`⚠️ Could not drop table "${table}":`, err.message);
      }
    }

    // Read and execute the init-postgres.sql file
    const initSqlPath = path.join(__dirname, 'config', 'init-postgres.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    // Execute the entire SQL file at once
    try {
      await pool.query(initSql);
      console.log('✅ All tables created from init-postgres.sql');
    } catch (err) {
      console.log('⚠️ Bulk SQL execution failed, trying individual statements...');

      // Fallback: Split SQL into individual statements and execute them
      const statements = initSql.split(';').filter(stmt => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.query(statement);
          } catch (err) {
            console.log(`⚠️ Statement failed:`, statement.substring(0, 50) + '...');
            console.log(`Error:`, err.message);
          }
        }
      }
    }

    console.log('✅ All tables created successfully');

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('📋 Created tables:', tablesResult.rows.map(row => row.table_name));

    // Verify comments table structure
    const commentsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'comments'
      ORDER BY ordinal_position
    `);
    console.log('📋 Comments table structure:');
    commentsStructure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Insert test data
    console.log('🔧 Inserting test data...');

    // Insert test user (password: test123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('test123', 10);
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password, is_admin)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['Test', 'User', 'test@example.com', hashedPassword, false]);

    // Insert test red flag
    await pool.query(`
      INSERT INTO red_flags (user_id, title, description, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [1, 'Test Red Flag', 'This is a test red flag report', 40.7128, -74.0060, 'draft']);

    // Insert test intervention
    await pool.query(`
      INSERT INTO interventions (user_id, title, description, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [1, 'Test Intervention', 'This is a test intervention report', 40.7128, -74.0060, 'draft']);

    console.log('✅ Test data inserted');

    // Test comment insertion
    console.log('🧪 Testing comment insertion...');
    await pool.query(`
      INSERT INTO comments (user_id, report_type, report_id, comment_text, comment_type)
      VALUES ($1, $2, $3, $4, $5)
    `, [1, 'red_flag', 1, 'This is a test comment on red flag', 'user']);

    await pool.query(`
      INSERT INTO comments (user_id, report_type, report_id, comment_text, comment_type)
      VALUES ($1, $2, $3, $4, $5)
    `, [1, 'intervention', 1, 'This is a test comment on intervention', 'user']);

    console.log('✅ Test comments inserted successfully');

    // Verify comments
    const redFlagComments = await pool.query(`
      SELECT c.*, u.first_name, u.last_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.report_type = $1 AND c.report_id = $2
    `, ['red_flag', 1]);

    const interventionComments = await pool.query(`
      SELECT c.*, u.first_name, u.last_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.report_type = $1 AND c.report_id = $2
    `, ['intervention', 1]);

    console.log(`📊 Red flag comments: ${redFlagComments.rows.length}`);
    console.log(`📊 Intervention comments: ${interventionComments.rows.length}`);

    console.log('🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!');
    console.log('🚀 Your comment system should now work perfectly!');

  } catch (err) {
    console.error('❌ Database setup failed:', err);
    throw err;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Database connection pool closed');
    }
  }
}

// Run the setup
setupDatabase().catch(console.error);
