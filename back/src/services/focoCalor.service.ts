import { query } from "../config/database";
import type { FeatureCollection } from "../types/FocoCalorEstado";
import type { EstatisticasEstado } from "../types/Statics";

export class FocoCalorService {
	async getFocosByEstado(estadoId: number): Promise<FeatureCollection> {
		const result = await query("SELECT * FROM get_focos_geojson($1)", [
			estadoId,
		]);

		if (result.rowCount === 0) {
			return { type: "FeatureCollection", features: [] }; // Retorna um FeatureCollection vazio
		}

		return result.rows[0].get_focos_geojson as FeatureCollection;
	}

	async getFocosByBioma(biomaId: number): Promise<FeatureCollection> {
		const result = await query("SELECT get_focos_geojson_bioma($1)", [biomaId]);

		console.log("o bioma é", biomaId);
		console.log(result);

		if (result.rowCount === 0) {
			return { type: "FeatureCollection", features: [] }; // Retorna um FeatureCollection vazio
		}

		return result.rows[0].get_focos_geojson_bioma as FeatureCollection;
	}

	async getBasicInfoByEstado(estadoId: number): Promise<EstatisticasEstado> {
		const result = await query(
			"SELECT * FROM estatisticas_estado_final WHERE id_estado = $1",
			[estadoId],
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
