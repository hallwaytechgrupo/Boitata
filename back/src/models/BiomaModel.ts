import type { MultiPolygon } from 'geojson';

export class BiomaModel {
  id_bioma: number;
  bioma: string;
  geo: MultiPolygon;

  constructor(id_bioma: number, bioma: string, geo: MultiPolygon) {
    this.id_bioma = id_bioma;
    this.bioma = bioma;
    this.geo = geo;
  }

  toSQLParams(): [number, string, string] {
    return [this.id_bioma, this.bioma, JSON.stringify(this.geo)];
  }
}
