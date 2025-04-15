import * as GeoJSON from "geojson";

export interface AreaQueimada {
  id_areaQueimada: number;
  mesReferencia: Date;
  geo: GeoJSON.MultiPolygon;
}
