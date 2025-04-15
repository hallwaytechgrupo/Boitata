import * as GeoJSON from "geojson";

export interface Estado {
  id_estado: number;
  estado: string;
  geo: GeoJSON.MultiPolygon;
}
