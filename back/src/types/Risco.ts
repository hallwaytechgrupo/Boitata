import * as GeoJSON from "geojson";

export interface Risco {
  id_risco: number;
  mesReferencia: Date;
  geo: GeoJSON.MultiPolygon;
}
