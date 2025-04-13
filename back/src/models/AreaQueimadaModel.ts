import { AreaQueimada } from "../types/AreaQueimada";
import { GeoEntity } from "./base/GeoEntity";

export class AreaQueimadaModel extends GeoEntity implements AreaQueimada {
  constructor(
    public id_area_queimada: string,
    public mes_referencia: Date,
    geo_area_queimada: GeoJSON.MultiPolygon
  ) {
    super(geo_area_queimada);
  }
}
