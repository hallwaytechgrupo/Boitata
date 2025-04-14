import { AreaQueimada } from "../types/AreaQueimada";
import { GeoEntity } from "./base/GeoEntity";
import * as GeoJSON from "geojson";

export class AreaQueimadaModel extends GeoEntity implements AreaQueimada {
  constructor(
    public id_area_queimada: string,
    public mes_referencia: Date,
    public geo_area_queimada: GeoJSON.MultiPolygon
  ) {
    super(geo_area_queimada);
  }
}
