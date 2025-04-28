import type { Pool } from 'pg';
import { CSVImporter } from '../../utils/import_focos_calor';
import path from 'node:path';
import { CSVDownloader } from '../../utils/csvDownloader';
import fs from 'node:fs';

const importFromURL = async (pool: Pool, url: string): Promise<void> => {
  console.log(' - Importando focos de calor de uma URL...');
  const csvFileName = path.basename(url);
  const downloadPath = path.resolve('focos_de_calor', csvFileName);

  const downloader = new CSVDownloader(url, downloadPath);
  await downloader.downloadCSV();

  const importer = new CSVImporter();
  await importer.importarCSV(pool, downloadPath);
  console.log(' ✓ Importação de URL concluída com sucesso!');
};

const importFromLocalFile = async (
  pool: Pool,
  filePath: string,
): Promise<void> => {
  console.log(' - Importando focos de calor de um arquivo local...');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo local não encontrado: ${filePath}`);
  }

  const importer = new CSVImporter();
  await importer.importarCSV(pool, filePath);
  console.log(' ✓ Importação de arquivo local concluída com sucesso!');
};

export const importFocosCalor = async (
  pool: Pool,
  source: string,
): Promise<void> => {
  try {
    console.log('++[FOCOS DE CALOR]++');
    if (source.startsWith('http')) {
      await importFromURL(pool, source);
    } else {
      await importFromLocalFile(pool, source);
    }
    console.log('--[FOCOS DE CALOR]--');
  } catch (error) {
    console.error('- Erro ao importar focos de calor:', error);
    throw error;
  }
};
