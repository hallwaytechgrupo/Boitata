import { Estado } from "../types/Estado";
import { GeoEntity } from "./base/GeoEntity";

export class EstadoModel extends GeoEntity implements Estado {
  constructor(
    public id_estado: number,
    public estado: string,
    geo_estado: GeoJSON.MultiPolygon
  ) {
    super(geo_estado);
  }
}
