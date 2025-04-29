import type { Pool } from 'pg';
import { runDatabaseMigrations } from './runMigrations';
import { populateDatabase } from '../services/database/databaseSetup';
import { importFromURL } from '../services/database/focosCalorImporter';

export const initializeDatabase = async (pool: Pool) => {
  console.log('[BANCO DE DADOS] - CONFIGURAÇÃO');
  await runDatabaseMigrations(pool);
  await populateDatabase(pool);
  console.log('[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n');

  if (process.env.NODE_ENV === 'local') {
    console.log('[BANCO DE DADOS] - IMPORTANDO DADOS DE FOCOS DE CALOR');
    const APR_2024 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202504.csv';

    await Promise.all([importFromURL(pool, APR_2024)]);
    console.log('[BANCO DE DADOS] - IMPORTAÇÃO DE FOCOS DE CALOR CONCLUÍDA');
  } else {
    console.log(
      'Ambiente Cloud detectado, portanto, não é necessário importar focos de calor.',
    );
  }

  console.log('[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n');
};
