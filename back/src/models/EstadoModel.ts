import type { MultiPolygon } from 'geojson';
import type { Estado } from '../types';

export class EstadoModel implements Estado {
  id_estado: number;
  estado: string;
  geo: MultiPolygon;

  constructor(id_estado: number, estado: string, geo: MultiPolygon) {
    this.id_estado = id_estado;
    this.estado = estado;
    this.geo = geo;
  }

  toSQLParams(): [number, string, string] {
    return [this.id_estado, this.estado, JSON.stringify(this.geo)];
  }
}
