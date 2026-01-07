import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.DB_HOST?.includes('supabase') ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.connect()
  .then((client: any) => {
    console.log('✓ PostgreSQL database connected successfully');
    client.release();
  })
  .catch((err: any) => {
    console.error('✗ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });

// Wrapper to maintain mysql2-like API
// mysql2 returns [rows, fields], pg returns { rows, fields }
const db = {
  query: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return [result.rows, result.fields];
  },
  pool
};

export default db;
