import { FocoCalor } from "../types/FocoCalor";
import * as GeoJSON from "geojson";

export class FocoCalorModel implements FocoCalor {
  constructor(
    public id_foco: string,
    public lat: number,
    public lon: number,
    public data_hora_gmt: Date,
    public satelite: string,
    public risco_fogo: number,
    public municipio_id: number,
    public bioma_id: number
  ) {}

  getGeoPoint(): GeoJSON.Point {
    return {
      type: "Point",
      coordinates: [this.lon, this.lat],
    };
  }

  static importarDados(): FocoCalorModel[] {
    // Simulação da importação de dados
    return [];
  }

  static filtrarPorEstado(
    id_estado: number,
    dados: FocoCalorModel[]
  ): FocoCalorModel[] {
    return dados.filter((foco) => foco.municipio_id === id_estado); // substitua por lógica geográfica real
  }

  static filtrarPorBioma(
    id_bioma: number,
    dados: FocoCalorModel[]
  ): FocoCalorModel[] {
    return dados.filter((foco) => foco.bioma_id === id_bioma);
  }

  static filtrarPorData(data: Date, dados: FocoCalorModel[]): FocoCalorModel[] {
    return dados.filter(
      (foco) => foco.data_hora_gmt.toDateString() === data.toDateString()
    );
  }

  static filtrarPorTriangulacao(
    focos: FocoCalorModel[]
  ): GeoJSON.FeatureCollection {
    const features = focos.map((foco) => ({
      type: "Feature" as const,
      geometry: foco.getGeoPoint(),
      properties: { id: foco.id_foco },
    }));
    return {
      type: "FeatureCollection",
      features,
    };
  }

  static gerarGraficoRiscoDeFogo(
    focos: FocoCalorModel[]
  ): Record<string, number> {
    const classificacao: Record<string, number> = {
      Baixo: 0,
      Alto: 0,
      Crítico: 0,
    };
    for (const foco of focos) {
      if (foco.risco_fogo >= 80) classificacao.Crítico++;
      else if (foco.risco_fogo >= 50) classificacao.Alto++;
      else classificacao.Baixo++;
    }
    return classificacao;
  }

  static gerarGraficoFocosCalor(
    focos: FocoCalorModel[]
  ): Record<string, number> {
    const porSatelite: Record<string, number> = {};
    for (const foco of focos) {
      porSatelite[foco.satelite] = (porSatelite[foco.satelite] || 0) + 1;
    }
    return porSatelite;
  }
}
