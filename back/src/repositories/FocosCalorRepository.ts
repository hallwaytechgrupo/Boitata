import type { ClientBase } from 'pg';
import fs from 'node:fs';
import { from as copyFrom } from 'pg-copy-streams';
import { query } from '../config/database';
import console from 'node:console';
import type { FeatureCollection } from '../types/FocoCalorEstado';

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

  /**
   * Retorna os focos de calor em formato GeoJSON para um município específico
   */
  async getFocosByMunicipioId(
    municipioId: string,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    const result = await query(
      'SELECT * FROM get_focos_geojson_municipio($1, $2, $3)',
      [municipioId, dataInicio ?? null, dataFim ?? null],
    );

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson_municipio) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_focos_geojson_municipio as FeatureCollection;
  }

  /**
   * Retorna os focos de calor em formato GeoJSON para um estado específico
   */
  async getFocosByEstado(
    estadoId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    const result = await query('SELECT * FROM get_focos_geojson($1, $2, $3)', [
      estadoId,
      dataInicio ?? null,
      dataFim ?? null,
    ]);

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_focos_geojson as FeatureCollection;
  }

  /**
   * Retorna os focos de calor em formato GeoJSON para um bioma específico
   */
  async getFocosByBioma(
    biomaId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    const result = await query(
      'SELECT * FROM get_focos_geojson_bioma($1, $2, $3)',
      [biomaId, dataInicio ?? null, dataFim ?? null],
    );

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson_bioma) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_focos_geojson_bioma as FeatureCollection;
  }

  /**
   * Retorna os dados do gráfico de focos de calor por ano e mês
   */
  async getGraficoDataPorAnoMes(
    ano?: number,
    mes?: number,
  ): Promise<
    {
      ano: number;
      mes: number;
      id_estado: number;
      numero_focos_calor: number;
    }[]
  > {
    const conditions: string[] = [];
    const params: (number | string)[] = [];

    if (ano !== undefined) {
      params.push(ano);
      conditions.push(`EXTRACT(YEAR FROM f.data_hora) = $${params.length}`);
    }
    if (mes !== undefined) {
      params.push(mes);
      conditions.push(`EXTRACT(MONTH FROM f.data_hora) = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryText = `
      SELECT 
        EXTRACT(YEAR FROM f.data_hora)::integer AS ano,
        EXTRACT(MONTH FROM f.data_hora)::integer AS mes,
        e.id_estado,
        COUNT(f.id_foco)::integer AS numero_focos_calor
      FROM 
        tb_focos_calor f
      JOIN 
        tb_municipios m ON f.id_municipio = m.id_municipio
      JOIN 
        tb_estados e ON m.id_estado = e.id_estado
      ${whereClause}
      GROUP BY 
        ano, mes, e.id_estado
      ORDER BY 
        ano, mes
    `;

    const result = await query(queryText, params);

    return result.rows.map((row) => ({
      ano: Number.parseInt(row.ano),
      mes: Number.parseInt(row.mes),
      id_estado: Number.parseInt(row.id_estado),
      numero_focos_calor: Number.parseInt(row.numero_focos_calor),
    }));
  }

  /**
   * Retorna as estatísticas de focos de calor por município
   */
  async getEstatisticasMunicipio(municipioId?: number): Promise<any> {
    try {
      let queryText = 'SELECT * FROM v_estatisticas_municipio';
      const params: any[] = [];

      if (municipioId !== undefined) {
        queryText += ' WHERE id_municipio = $1';
        params.push(municipioId);
      }

      const result = await query(queryText, params);
      return municipioId !== undefined ? result.rows[0] || null : result.rows;
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do município:', error);
      throw error;
    }
  }

  /**
   * Retorna as estatísticas de focos de calor por estado
   */
  async getEstatisticasEstado(estadoId?: number): Promise<any> {
    try {
      let queryText = 'SELECT * FROM v_estatisticas_estado_final';
      const params: any[] = [];

      if (estadoId !== undefined) {
        queryText += ' WHERE id_estado = $1';
        params.push(estadoId);
      }

      const result = await query(queryText, params);
      return estadoId !== undefined ? result.rows[0] || null : result.rows;
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do estado:', error);
      throw error;
    }
  }

  async getEstatisticasEstadoFinal(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM v_estatisticas_estado_final${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getKpiTotalFocosEstado(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_kpi_total_focos_estado${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getKpiMesMaiorFocos(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_kpi_mes_maior_focos${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getKpiRiscoMedioEstado(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_kpi_risco_medio_estado${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getKpiFocosPorSatelite(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_kpi_focos_por_satelite${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getGraficoEvolucaoTemporal(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_grafico_evolucao_temporal${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getGraficoComparacaoSatelite(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_grafico_comparacao_satelite${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getGraficoDistribuicaoEstado(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_grafico_distribuicao_estado${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  async getGraficoCorrelacaoRiscoFocos(estadoId?: number): Promise<any[]> {
    const params = estadoId !== undefined ? [estadoId] : [];
    const queryText = `SELECT * FROM vw_grafico_correlacao_risco_focos${estadoId !== undefined ? ' WHERE id_estado = $1' : ''}`;
    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Retorna as estatísticas de focos de calor por bioma
   */
  async getEstatisticasBioma(biomaId?: number): Promise<any> {
    try {
      let queryText = 'SELECT * FROM v_estatisticas_bioma';
      const params: any[] = [];

      if (biomaId !== undefined) {
        queryText += ' WHERE id_bioma = $1';
        params.push(biomaId);
      }

      const result = await query(queryText, params);
      return biomaId !== undefined ? result.rows[0] || null : result.rows;
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do bioma:', error);
      throw error;
    }
  }
}
