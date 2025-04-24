import type { Feature, FeatureCollection } from "geojson";
import { query } from "../config/database";

export interface BiomaGeoJSON {
	type: string;
	features: Array<{
		type: string;
		geometry: {
			type: string;
			coordinates: number[][][][];
		};
		properties: {
			id: number;
			nome: string;
		};
	}>;
}

export class BiomaService {
	// Busca todos os biomas no formato GeoJSON
	async getAllBiomasGeoJSON(): Promise<FeatureCollection> {
		try {
			console.log("buscando...");
			const result = await query("SELECT get_all_biomas_geojson()");
			console.log("olha q retornou");
			if (result.rowCount === 0) {
				return { type: "FeatureCollection", features: [] }; // Retorna um FeatureCollection vazio
			}
			console.log("imprimindo");
			console.log(result.rows[0]);
			return result.rows[0].get_all_biomas_geojson as FeatureCollection;
		} catch (error) {
			console.error("Erro ao buscar biomas:", error);
			throw error;
		}
	}

	// Versão alternativa se precisar dos dados brutos
	async getAllBiomas(): Promise<any[]> {
		const result = await query(
			"SELECT id_bioma, bioma, ST_AsGeoJSON(geometry) as geometry FROM tb_biomas",
		);
		return result.rows;
	}
}
