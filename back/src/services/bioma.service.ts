import path from 'node:path';
import { exec } from 'node:child_process';
import { query } from '../config/database';
import type { FeatureCollection } from 'geojson';
import { Console } from 'node:console';
import { Pool } from 'pg';
import fs from 'node:fs';
import { formatSQL } from '../repositories/BiomaRepository';

export class BiomaService {
  private shapefilePath = path.resolve(__dirname, '../utils/bioma/biomas.shp');
  private geoJsonFilePath = path.resolve(
    __dirname,
    '../utils/bioma/bioma.geojson',
  );

  private tempTableName = 'bioma'; // Tabela intermediária
  private finalTableName = 'tb_biomas';
  private srid = 4326;

  async importarBiomas(): Promise<void> {
    console.log('- Iniciando importação de biomas...');
    try {
      console.log(' - Verificando se a tabela de biomas já contém dados...');

      const checkQuery = `SELECT COUNT(*) AS count FROM ${this.finalTableName};`;
      const result = await query(checkQuery);

      if (result.rows[0].count > 0) {
        console.warn(' ⚠ Tabela já contém dados. Nenhuma ação necessária.');
        return;
      }

      console.log(' - Tabela vazia. Iniciando importação...');

      // Usando variáveis de ambiente do arquivo .env
      const command = `shp2pgsql -I -s ${this.srid} -W "UTF-8" "${this.shapefilePath}" public.${this.tempTableName} | psql -U ${process.env.DB_USER || 'postgres'} -d ${process.env.DB_NAME} -h ${process.env.DB_HOST || 'localhost'} -p ${process.env.DB_PORT || '5432'}`;

      // Exemplo do conteúdo necessário no arquivo .env:
      // DB_USER=postgres
      // DB_NAME=sua_database
      // DB_HOST=localhost
      // DB_PORT=5432

      await new Promise<void>((resolve, reject) => {
        exec(command, async (error, stdout, stderr) => {
          if (error) {
            console.error(' ✗ Erro ao executar o comando:', error);
            reject(error);
            return;
          }

          if (stderr) {
            console.log(' ⚠ Informação:', stderr);
          }

          if (stdout) {
            console.log(
              ' ✓ Importação de biomas, para a tabela temporária, concluída com sucesso!',
            );
          }
          try {
            console.log(
              ' [PROCESSANDO] Transferindo dados para a tabela de biomas final...',
            );
            await this.transferirDados();
            console.log(' ✓ Dados transferidos com sucesso!');

            console.log(' [PROCESSANDO] Excluindo tabela temporária...');
            await this.excluirTabelaTemporaria();
            console.log(' ✓ Tabela temporária excluída com sucesso!');

            resolve();
          } catch (transferError) {
            console.log(' ✗ Erro ao transferir dados:', transferError);
            reject(transferError);
          }
        });
      });
    } catch (error) {
      console.error(' ✗ Erro durante o processo de importação:', error);
      throw error;
    }
  }

  async importarBiomasGeoJSON(): Promise<void> {
    console.log('⬇ Iniciando importação de biomas a partir de GeoJSON...');
    try {
      // Verifica se a tabela de biomas já possui dados
      const checkQuery = `SELECT COUNT(*) AS count FROM ${this.finalTableName};`;
      const result = await query(checkQuery);

      if (result.rows[0].count > 0) {
        console.warn(' ⚠ Tabela já contém dados. Nenhuma ação necessária.');
        return;
      }

      const absolutePath = path.resolve(this.geoJsonFilePath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(
          ` ✗ Arquivo GeoJSON não encontrado no caminho: ${absolutePath}`,
        );
      }

      const geojson = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
      // Verifica se o arquivo contém biomas
      if (!geojson.features || geojson.features.length === 0) {
        throw new Error(' ✗ O arquivo GeoJSON não contém biomas.');
      }

      let biomasInseridos = 0;

      // Processa cada bioma no GeoJSON
      for (const feature of geojson.features) {
        const { id_bioma, bioma } = feature.properties;
        const geometry = feature.geometry;

        if (!geometry) {
          console.warn(
            ` ⚠ Geometria não encontrada para o bioma: ${bioma} (ID: ${id_bioma})`,
          );
          continue;
        }

        // Insere o bioma no banco de dados
        const insertQuery = `
          INSERT INTO ${this.finalTableName} (id_bioma, bioma, geometry)
          VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326));
        `;
        await query(insertQuery, [id_bioma, bioma, JSON.stringify(geometry)]);

        console.log('-----------BIOMA QUERY-----------');
        console.log(
          formatSQL(insertQuery, [id_bioma, bioma, JSON.stringify(geometry)]),
        );
        console.log('-----------BIOMA QUERY-----------');

        biomasInseridos++;
      }

      console.log(
        `✓ Importação concluída. ${biomasInseridos} biomas inseridos.`,
      );
    } catch (error) {
      console.error('✗ Erro durante a importação de biomas:', error);
      throw error;
    }
  }

  private async transferirDados(): Promise<void> {
    const transferQuery = `
      INSERT INTO ${this.finalTableName} (id_bioma, bioma, geometry)
      SELECT 
          cd_bioma AS id_bioma,
          bioma,
          geom AS geometry
      FROM ${this.tempTableName}
      WHERE cd_bioma IS NOT NULL;
    `;
    await query(transferQuery);
  }

  // Exclui a tabela intermediária
  private async excluirTabelaTemporaria(): Promise<void> {
    const dropQuery = `DROP TABLE IF EXISTS ${this.tempTableName};`;
    await query(dropQuery);
  }

  // Busca todos os biomas no formato GeoJSON
  async getAllBiomasGeoJSON(): Promise<FeatureCollection> {
    try {
      const result = await query('SELECT get_all_biomas_geojson()');
      if (result.rowCount === 0) {
        return { type: 'FeatureCollection', features: [] }; // Retorna um FeatureCollection vazio
      }
      return result.rows[0].get_all_biomas_geojson as FeatureCollection;
    } catch (error) {
      console.error(' ✗ Erro ao buscar biomas:', error);
      throw error;
    }
  }

  // Versão alternativa se precisar dos dados brutos
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getAllBiomas(): Promise<any[]> {
    const result = await query(
      'SELECT id_bioma, bioma, ST_AsGeoJSON(geometry) as geometry FROM tb_biomas',
    );
    return result.rows;
  }
}
