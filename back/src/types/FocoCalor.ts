export interface FocoCalor {
  id_foco: string;
  municipio_id: number;
  bioma_id: number;
  lat: number;
  lon: number;
  data_hora_gmt: Date;
  satelite: string;
  risco_fogo: number;
}
