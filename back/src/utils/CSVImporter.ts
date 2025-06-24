import type { ClientBase } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { FocosCalorRepository } from '../repositories/FocosCalorRepository';
import { ProcessedFilesRepository } from '../repositories/ProcessedFilesRepository';

export class CSVImporter {
  private focosRepository: FocosCalorRepository;
  private processedFilesRepository: ProcessedFilesRepository;

  constructor() {
    this.focosRepository = new FocosCalorRepository();
    this.processedFilesRepository = new ProcessedFilesRepository();
  }

  /**
   * Importa dados de um arquivo CSV para o banco de dados
   */
  async importarCSV(
    client: ClientBase,
    filePath: string,
    shouldManageTransaction = true,
  ): Promise<void> {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Arquivo não encontrado: ${absolutePath}`);
    }

    // Calcular o hash do arquivo para identificação única
    const fileHash = this.calcularHashDoArquivo(absolutePath);

    try {
      // Verificar se o arquivo já foi processado
      const isProcessed =
        await this.processedFilesRepository.verificarArquivoProcessado(
          client,
          fileHash,
        );

      if (isProcessed) {
        console.log('⚠ Arquivo já processado. Finalizando...');
        return;
      }

      console.log('- Arquivo não processado. Continuando...');

      // Gerenciar transação se necessário
      if (shouldManageTransaction) {
        await client.query('BEGIN');
      }

      // Processo ETL simplificado
      await this.focosRepository.criarOuLimparTabelaTemporaria(client);
      await this.focosRepository.carregarCSV(client, absolutePath);
      await this.focosRepository.processarDados(client);
      await this.processedFilesRepository.registrarArquivoProcessado(
        client,
        fileHash,
        path.basename(absolutePath),
      );

      if (shouldManageTransaction) {
        await client.query('COMMIT');
      }

      console.log('✓ Importação concluída com sucesso!');
    } catch (error) {
      if (shouldManageTransaction) {
        await client.query('ROLLBACK');
      }
      console.error('✗ Erro durante a importação:', error);
      throw error;
    }
  }

  /**
   * Calcula o hash MD5 de um arquivo para identificação única
   */
  private calcularHashDoArquivo(filePath: string): string {
    console.log(` - Calculando hash MD5 do arquivo: ${filePath}`);
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    return hash;
  }
}
