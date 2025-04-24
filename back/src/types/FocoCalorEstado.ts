export interface FeatureCollection {
	type: string;
	features: Feature[];
}

export interface Feature {
	type: string;
	geometry: Geometry;
	properties: Properties;
}

export interface Geometry {
	type: string;
	coordinates: [number, number];
}

export interface Properties {
	id: string;
	frp: number;
	data: string;
	risco: number;
	estado: string;
	satelite: string;
	municipio: string;
}
