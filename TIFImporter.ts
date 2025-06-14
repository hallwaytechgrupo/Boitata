import { PoolClient } from "pg";

import { spawnSync } from "node:child_process";

import fs from "node:fs";
import path from "node:path";

import wellknown from "wellknown";

//npm install wellknown

//npm install --save-dev @types/wellknown

//sudo apt-get update
//sudo apt-get install gdal-bin python3-gdal

/*Baixe o instalador do OSGeo4W:  
   [https://download.osgeo.org/osgeo4w/osgeo4w-setup-x86_64.exe]

2. Execute o instalador, escolha **Advanced Install**.

3. Na lista de pacotes, procure por `gdal` e marque para instalar (inclua também `gdal-python`).

4. Após instalar, abra o **OSGeo4W Shell** (atalho criado no menu iniciar).

5. No shell, rode:
   ```sh
   gdal_polygonize.py --help
   ```
   Se aparecer o help, está instalado corretamente.

*/

export class TIFImporter {
  async importarPoligonosDoTIF(
    client: PoolClient,
    filePath: string,
    mesReferencia: string
  ): Promise<void> {
    const fileName = path.basename(filePath);

    const geojsonPath = filePath.replace(/\.tif$/i, ".geojson");

    // Verifica se o GeoJSON já existe
    if (fs.existsSync(geojsonPath)) {
      console.log(
        `⏭️ Arquivo GeoJSON ${geojsonPath} já existe. Pulando geração e importação para ${fileName}.`
      );
      return;
    }

    // Executa gdal_polygonize para gerar GeoJSON
    const result = spawnSync("gdal_polygonize.py", [
      filePath,
      "-f",
      "GeoJSON",
      geojsonPath,
    ]);

    if (result.status !== 0) {
      throw new Error(
        `Erro ao rodar gdal_polygonize.py: ${result.stderr?.toString()}`
      );
    }

    // Lê o GeoJSON gerado
    const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf8"));

    // Para cada polígono, insere na tabela
    for (const feature of geojson.features) {
      if (
        (feature.geometry && feature.geometry.type === "Polygon") ||
        feature.geometry.type === "MultiPolygon"
      ) {
        const wkt = wellknown.stringify(feature.geometry);

        await client.query(
          `INSERT INTO tb_area_queimada (date, geometry) VALUES ($1, ST_GeomFromText($2, 4326))`,
          [mesReferencia, wkt]
        );

        await client.query(
          `INSERT INTO tb_risco_fogo (dn, geometry) VALUES ($1, ST_GeomFromText($2, 4326))`,
          [mesReferencia, wkt]
        );
      }
    }

    console.log(`✅ Polígonos do TIF ${fileName} importados com sucesso.`);
  }
}
