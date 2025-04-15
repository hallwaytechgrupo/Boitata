import { Estado } from "../types/Estado";
import { GeoEntity } from "./base/GeoEntity";
import * as GeoJSON from "geojson";

export class EstadoModel extends GeoEntity implements Estado {
  id_estado: number;
  estado: string;
  geo: GeoJSON.MultiPolygon;

  constructor(id_estado: number, estado: string, geo: GeoJSON.MultiPolygon) {
    super(geo);
    this.id_estado = id_estado;
    this.estado = estado;
    this.geo = geo;
  }

  static consultarEstado(): EstadoModel[] {
    // Simulação da consulta de estados
    return [];
  }
}
