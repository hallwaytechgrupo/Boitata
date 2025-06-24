import type { Pool } from 'pg';
import { BiomaService } from '../bioma.service';
import { MunicipioRepository } from './../../repositories/MunicipioRepository';
import { MunicipioService } from '../municipio.service';
import { EstadoRepository } from '../../repositories/EstadoRepository';
import { EstadoService } from '../estado.service';

export const populateDatabase = async (pool: Pool) => {
  const estadoRepository = new EstadoRepository(pool);
  const estadoService = new EstadoService(estadoRepository);

  const municipioRepository = new MunicipioRepository(pool);
  const municipioService = new MunicipioService(municipioRepository);

  const biomaService = new BiomaService();

  console.log('- Populando as tabelas do banco de dados...');

  console.log(' - Verificando necessidade de importação de dados...');

  try {
    console.log('++[BIOMA]++');
    await biomaService.importarBiomasGeoJSON();
    console.log('--[BIOMA]--');
    console.log();
    console.log('++[ESTADO]++');
    await estadoService.importarEstados(pool);
    console.log('--[ESTADO]--');
    console.log();
    console.log('++[MUNICÍPIO]++');
    await municipioService.importarMunicipios(pool);
    console.log('--[MUNICÍPIO]--');
    console.log();
    console.log('++[ÁREA OPERACIONAL]++');
    await municipioService.inserirMunicipioGeoJSONLocal(
      pool,
      './src/utils/area_operacional/area.geojson',
    );
    console.log('--[ÁREA OPERACIONAL]--');
  } catch (error) {
    console.error(' - Erro durante o setup do banco de dados:', error);
    process.exit(1);
  }
};
