export interface FocoCalor {
  id_foco: string;
  lat: number;
  lon: number;
  data_hora_gmt: Date;
  satelite: string;
  risco_fogo: number;
  municipio_id: number;
  bioma_id: number;
}
