import fs from 'node:fs';
import axios from 'axios';
import type { Pool } from 'pg';
import { MunicipioModel } from '../models/MunicipioModel';
import { municipiosBrasil } from '../utils/id_cidades';
import path from 'node:path';

export class MunicipioService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v4/malhas/municipios';

  async importarMunicipios(pool: Pool): Promise<void> {
    try {
      console.log('Verificando se a tabela municipios está vazia...');

      const rowsCount = await pool.query('SELECT COUNT(*) FROM tb_municipios');

      const { rows } = rowsCount;
      const count = Number.parseInt(rows[0].count, 10);

      if (count > 0) {
        console.log(
          ` - A tabela tb_municipios já contém ${count} registros. Nenhuma importação necessária.`,
        );
        return;
      }

      let municipiosCount = 0;

      for (const municipio of municipiosBrasil) {
        const { id_municipio, municipio: nome, id_estado } = municipio;

        //https://servicodados.ibge.gov.br/api/v4/malhas/municipios/1100015?formato=application/vnd.geo+json
        const response = await axios.get(
          `${this.baseUrl}/${id_municipio}?formato=application/vnd.geo+json`,
        );

        const geojson = response.data;
        const geo = geojson.features[0]?.geometry;

        if (!geo) {
          console.warn(
            ` - Geometria não encontrada para o municipio: ${municipio}`,
          );
          continue;
        }

        const municipioModel = new MunicipioModel(
          id_municipio,
          id_estado,
          nome,
          geo,
        );

        const query = `
          INSERT INTO tb_municipios (id_municipio, id_estado, municipio, geometry)
          VALUES ($1, $2, $3, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON($4), 4326)))
          ON CONFLICT (id_municipio) DO NOTHING
        `;

        await pool.query(query, municipioModel.toSQLParams());
        municipiosCount++;
      }

      console.log(
        `Importação finalizada! ${municipiosCount} municípios inseridos.`,
      );
    } catch (error) {
      console.log('Erro ao importar municípios:', error);
    }
  }

  async inserirMunicipioGeoJSONLocal(
    pool: Pool,
    geojsonPath: string,
  ): Promise<void> {
    try {
      const absolutePath = path.resolve(geojsonPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(
          `Arquivo GeoJSON não encontrado no caminho: ${absolutePath}`,
        );
      }

      const geojson = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));

      // Verifica se o arquivo contém exatamente um município
      if (!geojson.features || geojson.features.length !== 1) {
        throw new Error(
          'O arquivo GeoJSON deve conter exatamente um município.',
        );
      }

      const feature = geojson.features[0];
      const { id_municipio, id_estado, nome } = feature.properties;
      const geometry = feature.geometry;

      if (!geometry) {
        throw new Error('Geometria não encontrada no arquivo GeoJSON.');
      }

      const municipioModel = new MunicipioModel(
        id_municipio,
        id_estado,
        nome,
        geometry,
      );

      const query = `
			INSERT INTO tb_municipios (id_municipio, id_estado, municipio, geometry)
			VALUES ($1, $2, $3, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON($4), 4326)))
			ON CONFLICT (id_municipio) DO NOTHING
		  `;

      console.log(`Inserindo município: ${nome}...`);
      await pool.query(query, municipioModel.toSQLParams());
      console.log(`Município ${nome} inserido com sucesso.`);
    } catch (error) {
      console.error(
        'Erro ao inserir município a partir do GeoJSON local:',
        error,
      );
    }
  }
}
