import type { Pool } from "pg";

import { runDatabaseMigrations } from "./runMigrations";

import { populateDatabase } from "../services/database/databaseSetup";

import { importFromURL as importCSVFromURL } from "../services/database/focosCalorImporter";

import { importAreaQueimadaFromURL } from "../services/database/areaQueimadaImporter"; // Crie esse arquivo se ainda não existir

import { importRiscoFogoFromURL } from "../services/database/riscoFogoImporter"; // Importe a função para risco de fogo

const generateFocosCalorURLs = (year: number, months: number[]): string[] => {
  return months.map((month) => {
    const monthStr = month.toString().padStart(2, "0");

    return `https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_${year}${monthStr}.csv`;
  });
};

const generateAreaQueimadaURLs = (year: number, months: number[]): string[] => {
  return months.map((month) => {
    const monthStr = month.toString().padStart(2, "0");

    return `https://dataserver-coids.inpe.br/queimadas/queimadas/area_queimada/AQ1km/tif/aqm1km_${year}${monthStr}.tif`;
  });
};

const generateRiscoFogoURLs = (year: number, months: number[]): string[] => {
  return months.map((month) => {
    const monthStr = month.toString().padStart(2, "0");
    return `https://dataserver-coids.inpe.br/queimadas/queimadas/riscofogo_meteorologia/media_mensal_risco_de_fogo/2024/INPE_FireRiskModel_202406.tif`;
  });
};

const generateDateRangeURLs = (): string[] => {
  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1; // Janeiro é 0

  let allURLs: string[] = [];

  for (let year = 2024; year <= currentYear; year++) {
    let startMonth = 1;

    let endMonth = 12;

    if (year === 2024) {
      startMonth = 1;
    }

    // Para focos de calor, até o mês atual do ano corrente

    if (year === currentYear) {
      endMonth = currentMonth;
    }

    const months = Array.from(
      { length: endMonth - startMonth + 1 },

      (_, i) => startMonth + i
    );

    const urls = generateFocosCalorURLs(year, months);

    allURLs = allURLs.concat(urls);

    // Para área queimada, até o mês atual do ano corrente

    let aqEndMonth = year === currentYear ? currentMonth - 1 : 12;

    if (aqEndMonth > 0) {
      const aqMonths = Array.from(
        { length: aqEndMonth - startMonth + 1 },

        (_, i) => startMonth + i
      );

      const areaQueimadaURLs = generateAreaQueimadaURLs(year, aqMonths);

      allURLs = allURLs.concat(areaQueimadaURLs);
    }

    const riscoFogoURLs = generateRiscoFogoURLs(2024, [6]); // Gera URL para junho de 2024
    allURLs = allURLs.concat(riscoFogoURLs);
  }

  return allURLs;
};

export const initializeDatabase = async (pool: Pool) => {
  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO");

  await runDatabaseMigrations(pool);

  await populateDatabase(pool);

  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");

  if (process.env.NODE_ENV === "local") {
    console.log("[BANCO DE DADOS] - IMPORTANDO DADOS DE FOCOS DE CALOR");

    const allURLs = generateDateRangeURLs();

    // Separe URLs de CSV e TIF

    const csvURLs = allURLs.filter((url) => url.endsWith(".csv"));

    const tifURLs = allURLs.filter((url) => url.endsWith(".tif"));

    // Importe CSVs

    const csvResults = await Promise.allSettled(
      csvURLs.map((url) => importCSVFromURL(pool, url))
    );

    csvResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`Erro ao importar CSV (${csvURLs[idx]}):`, result.reason);
      }
    });

    // Importe TIFs

    const tifResults = await Promise.allSettled(
      tifURLs.map((url) => {
        if (url.includes("FireRiskModel")) {
          return importRiscoFogoFromURL(pool, url); // Importa risco de fogo
        } else {
          return importAreaQueimadaFromURL(pool, url); // Importa área queimada
        }
      })
    );

    tifResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`Erro ao importar TIF (${tifURLs[idx]}):`, result.reason);
      }
    });

    console.log("Importação de TIFs concluída");

    console.log("[BANCO DE DADOS] - IMPORTAÇÃO DE DADOS CONCLUÍDA");
  } else {
    console.log(
      "Ambiente Cloud detectado, portanto, não é necessário importar focos de calor."
    );
  }

  console.log("[BANCO DE DADOS] - CONFIGURAÇÃO CONCLUÍDA\n");
};
