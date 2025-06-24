import type { Pool } from 'pg';

export const verifyDatabaseConnection = async (
  pool: Pool,
): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()', []);
    console.log(
      '✅ Conexão bem-sucedida! Hora atual no banco de dados:',
      result.rows[0].now,
    );
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
};
