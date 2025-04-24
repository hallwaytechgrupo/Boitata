import { query } from "../config/database";
import type { FeatureCollection } from "../types/FocoCalorEstado";

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
}
