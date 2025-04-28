import { query } from './../config/database';
import fs from 'node:fs';
import axios from 'axios';
import type { Pool } from 'pg';
import { MunicipioModel } from '../models/MunicipioModel';
import { municipiosBrasil } from '../utils/id_cidades';
import path from 'node:path';
import type { MunicipioRepository } from '../repositories/MunicipioRepository';

export class MunicipioService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v4/malhas/municipios';
  private municipioRepository: MunicipioRepository;

  constructor(municipioRepository: MunicipioRepository) {
    this.municipioRepository = municipioRepository;
  }

  async importarMunicipios(pool: Pool): Promise<void> {
    try {
      console.log('⬇ Iniciando importação dos municípios...');

      const hasMunicipios = await this.municipioRepository.hasMunicipios();
      if (hasMunicipios) {
        console.log(
          ' - A tabela de municípios já contém dados. Nenhuma importação necessária.',
        );
        return;
      }

      const batchSize = Math.ceil(municipiosBrasil.length / 5);
      const batches = [];

      console.log(
        ` - Dividindo municípios em lotes de ${batchSize} itens por lote.`,
      );
      for (let i = 0; i < municipiosBrasil.length; i += batchSize) {
        batches.push(municipiosBrasil.slice(i, i + batchSize));
      }

      const results = await Promise.all(
        batches.map((batch, index) =>
          this.processarBatch(pool, batch, index + 1),
        ),
      );

      const totalInseridos = results.reduce((sum, count) => sum + count, 0);
      console.log(
        `✓ Importação concluída. ${totalInseridos} municípios inseridos.`,
      );
    } catch (error) {
      console.error('✗ Erro durante a importação dos municípios:');
    }
  }

  private async processarBatch(
    pool: Pool,
    batch: typeof municipiosBrasil,
    batchIndex: number,
  ): Promise<number> {
    let municipiosCount = 0;

    for (const municipio of batch) {
      const { id_municipio, municipio: nome, id_estado } = municipio;

      try {
        const response = await axios.get(
          `${this.baseUrl}/${id_municipio}?formato=application/vnd.geo+json`,
        );

        console.log(id_municipio);
        console.log(response.data);

        const geojson = response.data;
        const geo = geojson.features[0]?.geometry;

        if (!geo) {
          console.warn(
            `⚠ Geometria não encontrada para o município: ${nome} (ID: ${id_municipio})`,
          );
          continue;
        }

        const municipioModel = new MunicipioModel(
          id_municipio,
          id_estado,
          nome,
          geo,
        );

        await this.municipioRepository.inserirMunicipio(municipioModel);
        municipiosCount++;
      } catch (error) {
        console.error(
          `✗ Erro ao buscar ou inserir dados do município ${nome} (ID: ${id_municipio}):`,
          error,
        );
      }
    }
    return municipiosCount;
  }

  async inserirMunicipioGeoJSONLocal(
    pool: Pool,
    geojsonPath: string,
  ): Promise<void> {
    console.log('⬇ Iniciando inserção das áreas operacionais');

    try {
      // Verifica se as áreas operacionais já estão no banco
      const areasExistem =
        await this.municipioRepository.verificarAreasOperacionais();
      if (areasExistem) {
        console.warn(' ⚠ Tabela já possui as áreas operacionais.');
        return;
      }

      const absolutePath = path.resolve(geojsonPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(
          ` ✗ Arquivo GeoJSON não encontrado no caminho: ${absolutePath}`,
        );
      }

      const geojson = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
      // Verifica se o arquivo contém municípios
      if (!geojson.features || geojson.features.length === 0) {
        throw new Error(' ✗ O arquivo GeoJSON não contém municípios.');
      }

      let municipiosInseridos = 0;

      // Processa cada município no GeoJSON
      for (const feature of geojson.features) {
        const { id_municipio, id_estado, nome } = feature.properties;
        const geometry = feature.geometry;

        if (!geometry) {
          console.warn(
            ` ⚠ Geometria não encontrada para o município: ${nome} (ID: ${id_municipio})`,
          );
          continue;
        }

        const municipioModel = new MunicipioModel(
          id_municipio,
          id_estado,
          nome,
          geometry,
        );

        // Insere o município no banco de dados via repositório
        await this.municipioRepository.inserirMunicipio(municipioModel);
        municipiosInseridos++;
      }

      console.log(
        `✓ Inserção concluída. ${municipiosInseridos} municípios inseridos.`,
      );
    } catch (error) {
      console.error('✗ Erro durante a inserção das Áreas Operacionais:', error);
    }
  }
}
