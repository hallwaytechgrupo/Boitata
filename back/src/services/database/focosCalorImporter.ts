import type { Pool } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { CSVDownloader } from '../../utils/csvDownloader';
import { CSVImporter } from '../../utils/import_focos_calor';

export const importFromURL = async (pool: Pool, url: string): Promise<void> => {
  console.log(' - Importando focos de calor de uma URL...');
  const csvFileName = path.basename(url);
  const downloadPath = path.resolve('focos_de_calor', csvFileName);

  const downloader = new CSVDownloader(url, downloadPath);
  await downloader.downloadCSV();

  const importer = new CSVImporter();

  // Obter client do pool e gerenciar seu ciclo de vida
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await importer.importarCSV(client, downloadPath, false); // não gerenciar transação internamente
    await client.query('COMMIT');
    console.log(' ✓ Importação de URL concluída com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const importFromLocalFile = async (
  pool: Pool,
  filePath: string,
): Promise<void> => {
  console.log(' - Importando focos de calor de um arquivo local...');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo local não encontrado: ${filePath}`);
  }

  const importer = new CSVImporter();

  // Obter client do pool e gerenciar seu ciclo de vida
  const client = await pool.connect();
  try {
    await importer.importarCSV(client, filePath);
  } finally {
    client.release();
  }
};
