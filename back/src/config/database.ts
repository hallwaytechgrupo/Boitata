import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

console.log('Conectando ao banco de dados...');
console.log(
  `Usuário: ${process.env.DB_USER}, Host: ${process.env.DB_HOST}, Banco de dados: ${process.env.DB_NAME}, Porta: ${process.env.DB_PORT}`,
);

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export default pool;
