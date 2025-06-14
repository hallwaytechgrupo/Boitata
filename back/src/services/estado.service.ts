import axios from 'axios';
import type { Pool } from 'pg';
import { estadosBrasil } from '../utils/id_estados';
import { EstadoModel } from '../models';
import type { EstadoRepository } from '../repositories/EstadoRepository';
import * as fs from 'fs'; // Para ler o arquivo local
import * as path from 'path'; // Para construir o caminho do arquivo
import * as GeoJSON from 'geojson'; // Para tipagem

// Suponha que você tenha um arquivo states.geojson em back/src/data/states.geojson
const statesGeoJsonPath = path.join(__dirname, '../data/states.geojson');

export const getBordasEstadosGeoJSON = async (): Promise<GeoJSON.FeatureCollection> => {
  try {
    const data = await fs.promises.readFile(statesGeoJsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo GeoJSON dos estados:', error);
    // Retorne um GeoJSON vazio ou um erro, dependendo da sua estratégia
    return { type: 'FeatureCollection', features: [] };
  }
};
export class EstadoService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v4/malhas/estados';
  private estadoRepository: EstadoRepository;

  constructor(estadoRepository: EstadoRepository) {
    this.estadoRepository = estadoRepository;
  }

  async importarEstados(pool: Pool): Promise<void> {
    console.log('- Iniciando a importação dos estados');

    let estadosContados = 0;

    // Verifica se a tabela já contém dados
    const hasEstados = await this.estadoRepository.hasEstados();
    if (hasEstados) {
      console.log(
        ' - Tabela tb_estados já contém dados. Nenhuma importação necessária.',
      );
      return;
    }

    console.log(' - Tabela tb_estados está vazia. Iniciando importação...');

    for (const estado_atual of estadosBrasil) {
      const { id_estado, estado } = estado_atual;

      try {
        const response = await axios.get(
          `${this.baseUrl}/${id_estado}?formato=application/vnd.geo+json`,
        );
        const geojson = response.data;

        const geo = geojson.features[0]?.geometry;
        if (!geo) {
          console.warn(
            ` ⚠ Nenhum dado de geometria encontrado para o estado ${estado}. Pulando...`,
          );

          continue;
        }

        // Cria o modelo do estado
        const estadoModel = new EstadoModel(id_estado, estado, geo);

        // Inserindo o estado no banco de dados
        await this.estadoRepository.inserirEstado(estadoModel);
        estadosContados++;
      } catch (error) {
        console.error(` ✗ Erro ao importar o estado ${estado}: ${error}`);
      }
    }

    if (estadosContados > 0) {
      console.log(`- ${estadosContados} estados importados com sucesso!`);
    } else {
      console.warn(
        '- Nenhum estado foi importado. Verifique os dados ou a conexão.',
      );
    }
  }
}
