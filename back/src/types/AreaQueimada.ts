export interface AreaQueimada {
  id_area_queimada: string; // serial type in DB
  mes_referencia: Date;
  geo_area_queimada: GeoJSON.MultiPolygon;
}
