import { Bioma } from "../types/Bioma";
import { GeoEntity } from "./base/GeoEntity";

export class BiomaModel extends GeoEntity implements Bioma {
  constructor(
    public id_bioma: number,
    public bioma: string,
    public geo_bioma: GeoJSON.MultiPolygon
  ) {
    super(geo_bioma);
  }
}
