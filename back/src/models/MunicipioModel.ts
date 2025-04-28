import type { MultiPolygon } from 'geojson';
import type { Municipio } from '../types';

export class MunicipioModel implements Municipio {
  id_municipio: number;
  estado_id: number;
  municipio: string;
  geo_municipio: MultiPolygon;

  constructor(
    id_municipio: number,
    estado_id: number,
    municipio: string,
    geo_municipio: MultiPolygon,
  ) {
    this.id_municipio = id_municipio;
    this.estado_id = estado_id;
    this.municipio = municipio;
    this.geo_municipio = geo_municipio;
  }

  toSQLParams(): [number, number, string, string] {
    return [
      this.id_municipio,
      this.estado_id,
      this.municipio,
      JSON.stringify(this.geo_municipio),
    ];
  }
}
