import { FocoCalor } from "../types/FocoCalor";

export class FocoCalorModel implements FocoCalor {
  constructor(
    public id_foco: string,
    public municipio_id: number,
    public bioma_id: number,
    public lat: number,
    public lon: number,
    public data_hora_gmt: Date,
    public satelite: string,
    public risco_fogo: number
  ) {}
}
