export interface Municipio {
  id_municipio: number;
  estado_id: number;
  municipio: string;
  geo_municipio: GeoJSON.MultiPolygon;
}
