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

    const JAN_2025 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202501.csv';

    const FEB_2025 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202502.csv';

    const MAR_2025 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202503.csv';

    const APR_2025 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202504.csv';
    const MAY_2025 =
      'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202505.csv';

    await Promise.all([
      importFromURL(pool, JAN_2025),
      importFromURL(pool, FEB_2025),
      importFromURL(pool, MAR_2025),
      importFromURL(pool, APR_2025),
      importFromURL(pool, MAY_2025),
    ]);

    console.log('[BANCO DE DADOS] - IMPORTAÇÃO DE FOCOS DE CALOR CONCLUÍDA');
  } else {
    console.log(
      'Ambiente Cloud detectado, portanto, não é necessário importar focos de calor.',
    );
  }

  console.log('[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n');
};
