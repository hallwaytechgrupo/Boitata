import type { Pool } from "pg";
import { runDatabaseMigrations } from "./runMigrations";
import { populateDatabase } from "../services/database/databaseSetup";
import { importFromURL } from "../services/database/focosCalorImporter";

export const initializeDatabase = async (pool: Pool) => {
  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO");
  await runDatabaseMigrations(pool);
  await populateDatabase(pool);
  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");

  if (process.env.NODE_ENV === "local") {
    console.log("[BANCO DE DADOS] - IMPORTANDO DADOS DE FOCOS DE CALOR");

    const APR_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202404.csv";

    const MAY_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202405.csv";

    const JUN_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202406.csv";
    const JUL_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202407.csv";
    const AUG_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202408.csv";
    const SEP_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202409.csv";
    const OCT_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202410.csv";
    const NOV_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202411.csv";
    const DEC_2024 =
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202412.csv";

    await Promise.all([
      importFromURL(pool, APR_2024),
      importFromURL(pool, MAY_2024),
      importFromURL(pool, JUN_2024),
      importFromURL(pool, JUL_2024),
      importFromURL(pool, AUG_2024),
      importFromURL(pool, SEP_2024),
      importFromURL(pool, OCT_2024),
      importFromURL(pool, NOV_2024),
      importFromURL(pool, DEC_2024),
    ]);

    console.log("[BANCO DE DADOS] - IMPORTAÇÃO DE FOCOS DE CALOR CONCLUÍDA");
  } else {
    console.log(
      "Ambiente Cloud detectado, portanto, não é necessário importar focos de calor."
    );
  }

  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");
};
