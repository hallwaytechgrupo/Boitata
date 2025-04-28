import type { Pool } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

export const runDatabaseMigrations = async (pool: Pool): Promise<void> => {
  const migrationsPath = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsPath).sort();

  console.log('- Iniciando configuração do banco de dados...');

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        migration_file VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsPath, file);

      // Verifica se a migração já foi executada
      const { rowCount } = await pool.query(
        'SELECT 1 FROM migrations WHERE migration_file = $1 LIMIT 1;',
        [file],
      );

      if ((rowCount ?? 0) > 0) {
        console.log(`✓ Migração já executada: ${file}`);
        continue; // Pula para a próxima migração
      }

      // Lê e executa o arquivo SQL
      const sql = fs.readFileSync(filePath, 'utf-8');
      console.log(' [QUERY] Executando migração:', file);
      await pool.query(sql);

      // Registra a migração como executada
      await pool.query('INSERT INTO migrations (migration_file) VALUES ($1);', [
        file,
      ]);
      console.log(' ✓ Migração executada com sucesso:', file);
    }

    console.log('- Configuração do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('✗ Erro ao executar migrações:', error);
    throw error;
  }
};
