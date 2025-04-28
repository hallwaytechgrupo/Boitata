import type { Pool, ClientBase } from 'pg';

export class FocosCalorRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async verificarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM tb_arquivos_processados WHERE file_hash = $1 LIMIT 1;';
    const result = await client.query(query, [fileHash]);
    return (result.rowCount ?? 0) > 0;
  }

  async registrarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
  ): Promise<void> {
    const query =
      'INSERT INTO tb_arquivos_processados (file_hash) VALUES ($1);';
    await client.query(query, [fileHash]);
  }

  async criarOuLimparTabela(
    client: ClientBase,
    tempTableName: string,
  ): Promise<void> {
    const dropTableQuery = `DROP TABLE IF EXISTS ${tempTableName} CASCADE;`;
    const createTableQuery = `
            CREATE TEMP TABLE ${tempTableName} (
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

    await client.query(dropTableQuery);
    await client.query(createTableQuery);
  }

  async executarCopy(
    client: ClientBase,
    tempTableName: string,
    filePath: string,
  ): Promise<void> {
    const copyQuery = `
            COPY ${tempTableName} FROM '${filePath}'
            DELIMITER ',' CSV HEADER ENCODING 'UTF8';
        `;
    await client.query(copyQuery);
  }

  async processarDados(client: ClientBase): Promise<void> {
    const processQuery = 'SELECT processar_focos_calor();';
    await client.query(processQuery);
  }
}
