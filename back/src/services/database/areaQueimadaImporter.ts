import type { Pool } from "pg";

import fs from "node:fs";

import path from "node:path";

import { TIFDownloader } from "../../utils/tifDownloader";

import { TIFImporter } from "../../utils/TIFImporter";

function extrairAnoMes(nomeArquivo: string): { ano: number; mes: number } {
  const match = nomeArquivo.match(/(\d{4})(\d{2})/);

  if (!match)
    throw new Error("Não foi possível extrair ano e mês do nome do arquivo.");

  return {
    ano: parseInt(match[1], 10),

    mes: parseInt(match[2], 10),
  };
}

export const importAreaQueimadaFromURL = async (
  pool: Pool,
  url: string
): Promise<void> => {
  console.log(" - Importando dados de área queimada de uma URL...");

  const tifFileName = path.basename(url);

  const downloadDir = path.resolve("area_queimadas");
  // Cria a pasta se não existir
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const downloadPath = path.join(downloadDir, tifFileName);

  const downloader = new TIFDownloader(url, downloadPath);

  await downloader.downloadTIF();

  if (!fs.existsSync(downloadPath)) {
    throw new Error(
      `Arquivo TIF não encontrado após o download: ${downloadPath}`
    );
  }

  const { ano, mes } = extrairAnoMes(tifFileName);

  const client = await pool.connect();

  try {
    // Não use transação explícita para importação raster!

    const importer = new TIFImporter();

    await importer.importarPoligonosDoTIF(
      client,

      downloadPath,

      `${ano}${String(mes).padStart(2, "0")}`
    );

    // Opcional: registre o nome do arquivo e metadados em tabela auxiliar, se desejar

    console.log(" ✓ Importação de URL concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao importar TIF:", error);

    throw error;
  } finally {
    client.release();
  }
};

export const importAreaQueimadaFromLocalFile = async (
  pool: Pool,

  filePath: string
): Promise<void> => {
  console.log(" - Importando dados de área queimada de um arquivo local...");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo local não encontrado: ${filePath}`);
  }

  const tifFileName = path.basename(filePath);

  const { ano, mes } = extrairAnoMes(tifFileName);

  const client = await pool.connect();

  try {
    // Não use transação explícita para importação raster!

    const importer = new TIFImporter();

    await importer.importarPoligonosDoTIF(
      client,

      filePath,

      `${ano}${String(mes).padStart(2, "0")}`
    );

    // Opcional: registre o nome do arquivo e metadados em tabela auxiliar, se desejar

    console.log(" ✓ Importação de arquivo local concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao importar arquivo local:", error);

    throw error;
  } finally {
    client.release();
  }
};
