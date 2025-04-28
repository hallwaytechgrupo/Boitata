export interface CidadeEstatistica {
  municipio: string;
  total_focos: number;
}

export interface MaiorFRP {
  municipio: string;
  frp: number;
  data: string;
}

export interface EstatisticasEstado {
  id_estado: number;
  estado: string;
  top_cidades: CidadeEstatistica[];
  maior_frp: MaiorFRP;
  ultima_atualizacao: string;
}
