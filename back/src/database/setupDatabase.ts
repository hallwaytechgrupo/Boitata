import type { Pool } from "pg";
import { runDatabaseMigrations } from "./runMigrations";
import { populateDatabase } from "../services/database/databaseSetup";
import { importFocosCalor } from "../services/database/focosCalorImporter";

export const initializeDatabase = async (pool: Pool) => {
	console.log("[BANCO DE DADOS] - CONFIGURAÇÃO");
	await runDatabaseMigrations(pool);
	await populateDatabase(pool);
	console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");

	const APR_2024 =
		"https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202504.csv";

	await Promise.all([importFocosCalor(pool, APR_2024)]);

	console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");
};
