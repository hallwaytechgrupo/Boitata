import * as GeoJSON from "geojson";

export interface Bioma {
  id_bioma: number;
  bioma: string;
  geo: GeoJSON.MultiPolygon;
}
