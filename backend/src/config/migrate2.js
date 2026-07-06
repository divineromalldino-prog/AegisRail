const pool = require('./db');

const migrate = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        merchant_id UUID REFERENCES merchants(id),
        amount NUMERIC NOT NULL,
        currency VARCHAR(10) NOT NULL,
        email VARCHAR(255) NOT NULL,
        reference VARCHAR(255) UNIQUE NOT NULL,
        provider VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Transactions table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
