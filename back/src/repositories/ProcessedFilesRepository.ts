import type { ClientBase } from 'pg';

export class ProcessedFilesRepository {
  private tableName = 'tb_arquivos_processados';

  /**
   * Verifica se um arquivo já foi processado anteriormente
   */
  async verificarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
  ): Promise<boolean> {
    try {
      // Criar tabela se não existir
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id SERIAL PRIMARY KEY,
          file_hash TEXT NOT NULL UNIQUE,
          nome_arquivo TEXT,
          processado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Verificar se o hash existe
      const query = `SELECT 1 FROM ${this.tableName} WHERE file_hash = $1 LIMIT 1;`;
      const result = await client.query(query, [fileHash]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('✗ Erro ao verificar arquivo processado:', error);
      throw error;
    }
  }

  /**
   * Registra um arquivo como processado
   */
  async registrarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
    nomeArquivo: string,
  ): Promise<void> {
    try {
      const query = `INSERT INTO ${this.tableName} (file_hash) VALUES ($1);`;
      await client.query(query, [fileHash]);
      console.log('✓ Arquivo registrado como processado.');
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        // unique_violation
        console.log('⚠ Arquivo já registrado (concorrência)');
      } else {
        console.error('✗ Erro ao registrar arquivo:', error);
        throw error;
      }
    }
  }
}
