import type { Bioma } from "../types/Bioma";
import { GeoEntity } from "./base/GeoEntity";
import type * as GeoJSON from "geojson";

export class BiomaModel extends GeoEntity implements Bioma {
	public geo: GeoJSON.MultiPolygon;

	constructor(
		public id_bioma: number,
		public bioma: string,
		geo: GeoJSON.MultiPolygon,
	) {
		super(geo);
		this.geo = geo;
	}

	static consultarBioma(): BiomaModel[] {
		// Lógica real de consulta (placeholder por enquanto)
		return [];
	}