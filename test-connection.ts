// Test PostgreSQL connection
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // Important for Supabase
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query test:', result.rows[0]);
    
    client.release();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection();
