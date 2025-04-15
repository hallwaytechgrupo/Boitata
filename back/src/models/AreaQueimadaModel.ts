import { AreaQueimada } from "../types/AreaQueimada";
import { GeoEntity } from "./base/GeoEntity";
import * as GeoJSON from "geojson";

export class AreaQueimadaModel extends GeoEntity implements AreaQueimada {
  constructor(
    public id_areaQueimada: number,
    public mesReferencia: Date,
    public geo: GeoJSON.MultiPolygon
  ) {
    super(geo);
  }

  static importarDados(): AreaQueimadaModel[] {
    // Implementar importação real
    return [];
  }

  static filtrarPorEstado(idEstado: number): AreaQueimadaModel[] {
    return [];
  }

  static filtrarPorBioma(idBioma: number): AreaQueimadaModel[] {
    return [];
  }

  static filtrarPorMes(mes: number): AreaQueimadaModel[] {
    return [];
  }

  static gerarGraficoAreaQueimada(): void {
    // Lógica de geração de gráfico
  }
}
