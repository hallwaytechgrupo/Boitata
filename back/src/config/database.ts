import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isCloud = process.env.NODE_ENV === 'cloud';

const poolConfig = isCloud
  ? {
      user: process.env.CLOUD_DB_USER,
      host: process.env.CLOUD_DB_HOST,
      database: process.env.CLOUD_DB_NAME,
      password: process.env.CLOUD_DB_PASSWORD,
      port: Number(process.env.CLOUD_DB_PORT),
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    };

const pool = new Pool(poolConfig);

console.log(
  `Conectando ao banco de dados [${isCloud ? 'PRODUÇÃO' : 'LOCAL'}]...`,
);
console.log(
  `Usuário: ${poolConfig.user}, Host: ${poolConfig.host}, Banco de dados: ${poolConfig.database}, Porta: ${poolConfig.port}`,
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
