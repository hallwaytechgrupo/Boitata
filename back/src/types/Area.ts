import * as GeoJSON from "geojson";

export interface Area {
  id_areaQueimada: number;
  mesReferencia: Date;
  geo: GeoJSON.MultiPolygon;
}
