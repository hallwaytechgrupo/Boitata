import type { Pool } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

export const runDatabaseMigrations = async (pool: Pool): Promise<void> => {
  const migrationsPath = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsPath).sort();

  console.log('- Iniciando configuração do banco de dados...');

  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(' [QUERY] Executando migração:', file);
      await pool.query(sql);
      console.log(' ✓ Migração executada com sucesso:', file);
    }
    console.log('- Configuração do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('✗ Erro ao executar migrações:', error);
    throw error;
  }
};
