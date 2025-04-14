import { Municipio } from "../types/Municipio";
import { GeoEntity } from "./base/GeoEntity";

export class MunicipioModel extends GeoEntity implements Municipio {
  public geo_municipio: GeoJSON.MultiPolygon;

  constructor(
    public id_municipio: number,
    public estado_id: number,
    public municipio: string,
    geo_municipio: GeoJSON.MultiPolygon
  ) {
    super(geo_municipio);
    this.geo_municipio = geo_municipio;
  }
}
