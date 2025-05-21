import type { AreaQueimada } from '../types/AreaQueimada';
import type * as GeoJSON from 'geojson';

export class AreaQueimadaModel implements AreaQueimada {
  id_area_queimada: number;
  date: string;
  geometry: GeoJSON.MultiPolygon;

  constructor(
    id_area_queimada: number,
    date: string,
    geometry: GeoJSON.MultiPolygon,
  ) {
    this.id_area_queimada = id_area_queimada;
    this.date = date;
    this.geometry = geometry;
  }
}
