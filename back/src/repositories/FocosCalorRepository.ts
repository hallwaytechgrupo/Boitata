import type { ClientBase } from 'pg';
import fs from 'node:fs';
import { from as copyFrom } from 'pg-copy-streams';

export class FocosCalorRepository {
  private tempTableName = 'temp_focos_calor';

  /**
   * Cria ou limpa a tabela temporária para importação
   */
  async criarOuLimparTabelaTemporaria(client: ClientBase): Promise<void> {
    try {
      // Remova a tabela, se existir
      await client.query(`DROP TABLE IF EXISTS ${this.tempTableName} CASCADE;`);
      console.log(' - Excluindo tabela temporária, se existir...');

      console.log(' - Criando tabela temporária...');
      const createTableQuery = `
        CREATE TEMP TABLE ${this.tempTableName} (
          id TEXT UNIQUE,
          lat NUMERIC,
          lon NUMERIC,
          data_hora_gmt TIMESTAMP,
          satelite TEXT,
          municipio TEXT,
          estado TEXT,
          pais TEXT,
          municipio_id INTEGER,
          estado_id INTEGER,
          pais_id INTEGER,
          numero_dias_sem_chuva NUMERIC,
          precipitacao NUMERIC,
          risco_fogo NUMERIC,
          bioma TEXT,
          frp NUMERIC
        );
      `;
      await client.query(createTableQuery);
      console.log(' ✓ Tabela temporária criada com sucesso.');
    } catch (error) {
      console.error('✗ Erro ao criar tabela temporária:', error);
      throw error;
    }
  }

  /**
   * Carrega dados de um CSV para a tabela temporária
   */
  async carregarCSV(client: ClientBase, filePath: string): Promise<void> {
    try {
      const { from: copyFrom } = require('pg-copy-streams');

      console.log('⬇ Enviando dados do CSV para a tabela temporária...');

      return new Promise<void>((resolve, reject) => {
        const stream = client.query(
          copyFrom(
            `COPY ${this.tempTableName} FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ',')`,
          ),
        );
        const fileStream = fs.createReadStream(filePath);

        fileStream.on('error', reject);
        stream.on('error', reject);
        stream.on('finish', () => {
          console.log(' ✓ Dados copiados com sucesso.');
          resolve();
        });

        fileStream.pipe(stream);
      });
    } catch (error) {
      console.error('✗ Erro ao carregar CSV:', error);
      throw error;
    }
  }

  async executarCopy(client: ClientBase, filePath: string): Promise<void> {
    console.log('⬇ Enviando dados do CSV para a tabela temporária...');

    return new Promise<void>((resolve, reject) => {
      // Cria um stream de COPY usando pg-copy-streams
      const stream = client.query(
        copyFrom(
          `COPY ${this.tempTableName} FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ',', ENCODING 'UTF8')`,
        ),
      );

      // Cria um stream para ler o arquivo
      const fileStream = fs.createReadStream(filePath);

      // Tratamento de erros no stream de leitura
      fileStream.on('error', (error) => {
        console.error('✗ Erro ao ler o arquivo CSV:', error);
        reject(error);
      });

      // Tratamento de erros no stream de COPY
      stream.on('error', (error) => {
        console.error('✗ Erro ao copiar dados para o PostgreSQL:', error);
        reject(error);
      });

      // Quando o COPY terminar com sucesso
      stream.on('finish', () => {
        console.log(' ✓ Dados copiados com sucesso para a tabela temporária.');
        resolve();
      });

      // Conecta o stream do arquivo ao stream de COPY
      fileStream.pipe(stream);
    });
  }

  /**
   * Processa os dados da tabela temporária e carrega na tabela definitiva
   */
  async processarDados(client: ClientBase): Promise<void> {
    try {
      console.log('⬇ Processando dados de focos de calor...');
      await client.query('SELECT processar_focos_calor();');
      console.log('✓ Dados processados com sucesso.');
    } catch (error) {
      console.error('✗ Erro ao processar dados:', error);
      throw error;
    }
  }
}
