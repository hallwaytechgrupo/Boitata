import { saveToCSVFile } from './file/saveToFile';
import axios from 'axios';
import fs from 'node:fs';
import cron from 'node-cron';

export class CSVDownloader {
  private downloadUrl: string;
  private downloadPath: string;

  constructor(downloadUrl: string, downloadPath: string) {
    this.downloadUrl = downloadUrl;
    this.downloadPath = downloadPath;
  }

  async downloadCSV(forceDownload = false): Promise<boolean> {
    try {
      if (!forceDownload && fs.existsSync(this.downloadPath)) {
        console.log('✓ Arquivo já existe. Pulando download.');
        return false; // Indica que o download não foi necessário
      }

      console.log('⬇ Iniciando download do arquivo CSV...');

      const response = await axios.get(this.downloadUrl, {
        responseType: 'stream',
      });

      await saveToCSVFile(response.data, this.downloadPath);

      console.log('✓ Download concluído com sucesso!');
      return true; // Indica que o download foi realizado
    } catch (error) {
      console.error('✗ Erro durante o download do arquivo CSV:', error);
      throw error;
    }
  }

  scheduleCronJob(): void {
    console.log('Agendando cron job para executar diariamente às 00:00...');
    cron.schedule('0 0 * * *', async () => {
      console.log(`[${new Date().toISOString()}] Executando cron job...`);
      try {
        await this.downloadCSV();
        // await this.executeImport();
      } catch (error) {
        console.error('Erro durante a execução do cron job:', error);
      }
    });
  }
}
