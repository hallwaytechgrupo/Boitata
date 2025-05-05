import { Risco } from "../types/Risco";
import { GeoEntity } from "./base/GeoEntity";
import * as GeoJSON from "geojson";

export class RiscoModel extends GeoEntity implements Risco {
  id_risco: number;
  risco: string;
  geo: GeoJSON.MultiPolygon;
  mesReferencia: Date;

  constructor(id_risco: number, risco: string, geo: GeoJSON.MultiPolygon, mesReferencia: Date) {
    super(geo);
    this.id_risco = id_risco;
    this.risco = risco;
    this.geo = geo;
    this.mesReferencia = mesReferencia;
  }

  static consultarRisco(): RiscoModel[] {
    // Simulação da consulta de Riscos
    return [];
  }
}
