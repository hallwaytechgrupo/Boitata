import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Pool, ClientBase } from 'pg';

export class CSVImporter {
  private tempTableName = process.env.TEMP_TABLE_NAME || 'temp_focos_calor';
  private processedFilesTable = 'tb_arquivos_processados';

  async importarCSV(pool: Pool, filePath: string): Promise<void> {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`✗ Arquivo CSV não encontrado no caminho: ${absolutePath}`);
      throw new Error(`Arquivo CSV não encontrado no caminho: ${absolutePath}`);
    }

    const fileHash = this.calcularHashDoArquivo(absolutePath);

    const client = await pool.connect();
    try {
      console.log('⚠ Verificando se o arquivo já foi processado...');

      const isProcessed = await this.verificarArquivoProcessado(
        client,
        fileHash,
      );

      if (isProcessed) {
        console.warn('⚠ Arquivo já processado. Finalizando...');
        return;
      }

      console.log('- Arquivo não processado. Continuando...');
      await client.query('BEGIN');
      await this.criarOuLimparTabela(client);
      await this.executarCopy(client, absolutePath);
      await this.processarDados(client);
      await this.registrarArquivoProcessado(client, fileHash);
      await client.query('COMMIT');

      console.log('✓ Importação concluída com sucesso!');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Erro durante a importação:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private calcularHashDoArquivo(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }
    if (path.extname(filePath) !== '.csv') {
      throw new Error(`O arquivo deve ser um CSV: ${filePath}`);
    }
    if (fs.statSync(filePath).size === 0) {
      throw new Error(`O arquivo está vazio: ${filePath}`);
    }
    console.log(` - Calculando hash MD5 do arquivo: ${filePath}`);
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    return hash;
  }

  private async verificarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
  ): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.processedFilesTable} WHERE file_hash = $1 LIMIT 1;`;
    const result = await client.query(query, [fileHash]);
    return (result.rowCount ?? 0) > 0;
  }

  private async registrarArquivoProcessado(
    client: ClientBase,
    fileHash: string,
  ): Promise<void> {
    try {
      const query = `INSERT INTO ${this.processedFilesTable} (file_hash) VALUES ($1);`;
      await client.query(query, [fileHash]);
      console.log('✓ Arquivo registrado como processado com sucesso.');
    } catch (error) {
      console.error('✗ Erro ao registrar arquivo processado:', error);
      throw error;
    }
  }

  private async criarOuLimparTabela(client: ClientBase): Promise<void> {
    const checkTablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'pg_temp';
`;
    const tables = await client.query(checkTablesQuery);

    if ((tables.rowCount ?? 0) > 0) {
      console.log(' - Tabelas temporárias existentes:', tables.rows);
    } else {
      console.log(' - Nenhuma tabela temporária encontrada.');
    }
    // Remova a tabela, se existir
    const dropTableQuery = 'DROP TABLE IF EXISTS temp_focos_calor CASCADE;';

    console.log(' - Excluindo tabela temporária, se existir...');

    await client.query(dropTableQuery);

    console.log(' - Criando tabela temporária...');
    const createTableQuery = `
        CREATE TEMP TABLE temp_focos_calor (
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
  }

  // private async criarOuLimparTabelaTemporaria(
  // 	client: ClientBase,
  // ): Promise<void> {
  // 	// Verifica se a tabela temporária já existe
  // 	const checkTableQuery = `
  // 	  SELECT EXISTS (
  // 		  SELECT 1
  // 		  FROM information_schema.tables
  // 		  WHERE table_name = '${this.tempTableName}'
  // 	  );
  // 	`;
  // 	const result = await client.query(checkTableQuery);

  // 	if (result.rows[0].exists) {
  // 		// Se a tabela já existe, apenas limpa os dados
  // 		console.log("Tabela temporária já existe. Limpando os dados...");
  // 		const truncateQuery = `TRUNCATE TABLE ${this.tempTableName};`;
  // 		await client.query(truncateQuery);
  // 		console.log("Tabela temporária truncada com sucesso.");
  // 	} else {
  // 		// Se a tabela não existe, cria a tabela
  // 		console.log("Criando tabela temporária...");
  // 		const createTableQuery = `
  // 		  CREATE TABLE ${this.tempTableName} (
  // 			  id TEXT UNIQUE,
  // 			  lat NUMERIC,
  // 			  lon NUMERIC,
  // 			  data_hora_gmt TIMESTAMP,
  // 			  satelite TEXT,
  // 			  municipio TEXT,
  // 			  estado TEXT,
  // 			  pais TEXT,
  // 			  municipio_id INTEGER,
  // 			  estado_id INTEGER,
  // 			  pais_id INTEGER,
  // 			  numero_dias_sem_chuva NUMERIC,
  // 			  precipitacao NUMERIC,
  // 			  risco_fogo NUMERIC,
  // 			  bioma TEXT,
  // 			  frp NUMERIC
  // 		  );
  // 		`;
  // 		await client.query(createTableQuery);
  // 		console.log("Tabela temporária criada com sucesso.");
  // 	}
  // }

  private async executarCopy(
    client: ClientBase,
    filePath: string,
  ): Promise<void> {
    const copyQuery = `
      COPY ${this.tempTableName} FROM '${filePath}'
      DELIMITER ',' CSV HEADER ENCODING 'UTF8'
    `;
    console.log(
      '⬇ Executando comando COPY (movendo do CSV para a tabela temporária)...',
    );
    try {
      await client.query(copyQuery);
      console.log(' ✓ Dados copiados com sucesso para a tabela temporária.');
    } catch (error) {
      console.error('✗ Erro ao executar o comando COPY:', error);
      throw error;
    }
  }

  private async processarDados(client: ClientBase): Promise<void> {
    const processQuery = 'SELECT processar_focos_calor();';
    console.log('- Chamando a função processar_focos_calor...');
    try {
      console.log(' ⬇ Populando dados de calor...');
      await client.query(processQuery);
      console.log('✓ Dados processados com sucesso.');
    } catch (error) {
      console.error('✗ Erro ao processar dados:', error);
      throw error;
    }
  }
}
