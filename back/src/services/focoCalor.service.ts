import { query } from "../config/database";
import type { FeatureCollection } from "../types/FocoCalorEstado";
import type { EstatisticasEstado } from "../types/Statics";

export class FocoCalorService {
  async getGraficoData(
    ano?: number,
    mes?: number
  ): Promise<
    {
      ano: number;
      mes: number;
      id_estado: number;
      numero_focos_calor: number;
    }[]
  > {
    const conditions: string[] = [];
    const params: (number | string)[] = [];

    if (ano !== undefined) {
      params.push(ano);
      conditions.push(`EXTRACT(YEAR FROM f.data_hora) = $${params.length}`);
    }

    if (mes !== undefined) {
      params.push(mes);
      conditions.push(`EXTRACT(MONTH FROM f.data_hora) = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const queryText = `
      SELECT 
        EXTRACT(YEAR FROM f.data_hora)::integer AS ano,
        EXTRACT(MONTH FROM f.data_hora)::integer AS mes,
        e.id_estado,
        COUNT(f.id_foco)::integer AS numero_focos_calor
      FROM 
        tb_focos_calor f
      JOIN 
        tb_municipios m ON f.id_municipio = m.id_municipio
      JOIN 
        tb_estados e ON m.id_estado = e.id_estado
      ${whereClause}
      GROUP BY 
        ano, mes, e.id_estado
      ORDER BY 
        ano, mes
    `;

    const result = await query(queryText, params);

    return result.rows.map((row) => ({
      ano: Number.parseInt(row.ano),
      mes: Number.parseInt(row.mes),
      id_estado: Number.parseInt(row.id_estado),
      numero_focos_calor: Number.parseInt(row.numero_focos_calor),
    }));
  }

  async getFocosByEstado(estadoId: number): Promise<FeatureCollection> {
    const result = await query("SELECT * FROM get_focos_geojson($1)", [
      estadoId,
    ]);

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson) {
      return { type: "FeatureCollection", features: [] };
    }

    return result.rows[0].get_focos_geojson as FeatureCollection;
  }

  async getFocosByBioma(biomaId: number): Promise<FeatureCollection> {
    const result = await query("SELECT get_focos_geojson_bioma($1)", [biomaId]);

    console.log("o bioma é", biomaId);
    console.log(result);

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson_bioma) {
      return { type: "FeatureCollection", features: [] };
    }

    return result.rows[0].get_focos_geojson_bioma as FeatureCollection;
  }

  async getBasicInfoByEstado(estadoId: number): Promise<EstatisticasEstado> {
    const result = await query(
      "SELECT * FROM v_estatisticas_estado_final WHERE id_estado = $1",
      [estadoId]
    );

    if (result.rowCount === 0) {
      return {
        id_estado: estadoId,
        estado: "",
        top_cidades: [],
        maior_frp: {
          municipio: "Nenhum dado disponível",
          frp: 0,
          data: "",
        },
        ultima_atualizacao: new Date().toISOString(),
      };
    }

    const row = result.rows[0];

    return {
      id_estado: row.id_estado,
      estado: row.estado,
      top_cidades: row.top_cidades || [],
      maior_frp: row.maior_frp || {
        municipio: "Nenhum dado disponível",
        frp: 0,
        data: "",
      },
      ultima_atualizacao: row.ultima_atualizacao,
    };
  }
}
