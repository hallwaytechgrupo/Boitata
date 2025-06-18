import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

/**
 * Busca dados para o gráfico de focos de calor por estado com filtros de mês e ano
 * @param mes O mês para filtrar (1-12)
 * @param ano O ano para filtrar
 * @returns Dados formatados para exibição no gráfico
 */
export const getGraficoFocosCalor = async (mes: number, ano: number) => {
  try {
    const response = await api.get('focos_calor/grafico', {
      params: {
        mes,
        ano,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados para gráfico:', error);
    throw error;
  }
};

export const getFocosCalorByEstadoId = async (
  estadoId: string,
  dataInicio?: string,
  dataFim?: string,
) => {
  try {
    const response = await api.get(`focos_calor/estado/${estadoId}`, {
      params: {
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching focosCalor:', error);
    throw error;
  }
};

export const getFocosCalorByMunicipioId = async (
  municipioId: string,
  dataInicio?: string,
  dataFim?: string,
) => {
  try {
    const response = await api.get(`focos_calor/municipio/${municipioId}`, {
      params: {
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching focosCalor:', error);
    throw error;
  }
};

export const getFocosByBiomaId = async (
  biomaId: string,
  dataInicio?: string,
  dataFim?: string,
) => {
  try {

    console.log('Fetching focosCalor for biomaId:', biomaId, 'from', dataInicio, 'to', dataFim);
    console.log('API URL:', `focos_calor/bioma/${biomaId}`);

    const response = await api.get(`focos_calor/bioma/${biomaId}`, {
      params: {
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      },
    });

    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching focosCalor:', error);
    throw error;
  }
};

export const getStateInfo = async (estadoId: string) => {
  try {
    const response = await api.get(`focos_calor/estado/info/${estadoId}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching stateInfo:', error);
    throw error;
  }
};

// Estatísticas por Estado
export async function getEstatisticasEstado(estadoId?: string) {
  try {
    const url = `focos_calor/estado/info/${estadoId}`;

    const response = await api.get(url);

    return response.data;
  } catch (error) {
    console.error('Erro na requisição de estatísticas do estado:', error);
    throw error;
  }
}

// Estatísticas finais do Estado
export async function getEstatisticasEstadoFinal(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/estatisticas-final/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas finais do estado:', error);
    throw error;
  }
}

// KPI: Total de focos por Estado
export async function getKpiTotalFocosEstado(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/kpi-total-focos/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar KPI total de focos do estado:', error);
    throw error;
  }
}

// KPI: Mês com maior número de focos por Estado
export async function getKpiMesMaiorFocos(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/kpi-mes-maior-focos/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar KPI mês com maior número de focos:', error);
    throw error;
  }
}

// KPI: Risco médio por Estado
export async function getKpiRiscoMedioEstado(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/kpi-risco-medio/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar KPI risco médio do estado:', error);
    throw error;
  }
}

// KPI: Focos por satélite por Estado
export async function getKpiFocosPorSatelite(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/kpi-focos-por-satelite/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar KPI focos por satélite:', error);
    throw error;
  }
}

// Gráfico: Evolução temporal dos focos por Estado
export async function getGraficoEvolucaoTemporal(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/grafico-evolucao-temporal/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar gráfico de evolução temporal:', error);
    throw error;
  }
}

// Gráfico: Comparação de focos por satélite por Estado
export async function getGraficoComparacaoSatelite(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/grafico-comparacao-satelite/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar gráfico de comparação por satélite:', error);
    throw error;
  }
}

// Gráfico: Distribuição dos focos por Estado
export async function getGraficoDistribuicaoEstado(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/grafico-distribuicao/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar gráfico de distribuição do estado:', error);
    throw error;
  }
}

// Gráfico: Correlação entre risco e focos por Estado
export async function getGraficoCorrelacaoRiscoFocos(estadoId: string) {
  try {
    const response = await api.get(`focos_calor/estado/grafico-correlacao-risco-focos/${estadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar gráfico de correlação risco-focos:', error);
    throw error;
  }
}

// Estatísticas por Município
export async function getEstatisticasMunicipio(municipioId?: string) {
  try {
    const url = `focos_calor/municipio/info/${municipioId}`;

    const response = await api.get(url);

    return response.data;
  } catch (error) {
    console.error('Erro na requisição de estatísticas do município:', error);
    throw error;
  }
}

// Estatísticas por Bioma
export async function getEstatisticasBioma(biomaId?: string) {
  try {
    const url = `focos_calor/bioma/info/${biomaId}`;

    const response = await api.get(url);

    return response.data;
  } catch (error) {
    console.error('Erro na requisição de estatísticas do bioma:', error);
    throw error;
  }
}

export async function getAreaQueimadaByBiomaId(
  biomaId: string,
  dataInicio?: string,
  dataFim?: string,
) {
  try {
    const response = await api.get(`area_queimada/bioma/${biomaId}`, {
      params: {
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching areaQueimada:', error);
    throw error;
  }
}

export async function getAreaQueimadaByEstadoId(
  estadoId: string,
  dataInicio?: string,
  dataFim?: string,
) {
  try {
    const response = await api.get(`area_queimada/estado/${estadoId}`, {
      params: {
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching areaQueimada:', error);
    throw error;
  }
}

export const getBiomasShp = async () => {
  try {
    const response = await api.get('biomas');
    return response.data;
  } catch (error) {
    console.error('Error fetching biomas:', error);
    throw error;
  }  
};

export const getEstadosShp = async () => {
  try {
    const response = await api.get('estados');
    return response.data;
  } catch (error) {
    console.error('Error fetching estados:', error);
    throw error;
  }  
};

export async function getEstatisticasAreaQueimadaEstado() {
    try {
      const response = await api.get('area_queimada/info/estado');
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de estatísticas de área queimada por estado:', error);
      throw error;
    }
  }

  export async function getEstatisticasAreaQueimadaBioma() {
    try {
      const response = await api.get('area_queimada/info/bioma');
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de estatísticas de área queimada por bioma:', error);
      throw error;
    }
  }

  export async function getRankingEstadosAreaQueimada() {
    try {
      const response = await api.get('area_queimada/ranking/estados');
      return response.data;
    } catch (error) {
      console.error('Erro na requisição do ranking de estados por área queimada:', error);
      throw error;
    }
  }

  export async function getKpiBioma() {
    try {
      const response = await api.get('focos_calor/bioma/kpi');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar KPI dos biomas:', error);
      throw error;
    }
  }

  export async function getDistribuicaoFocosPorBioma() {
    try {
      const response = await api.get('focos_calor/bioma/distribuicao-focos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar distribuição de focos por bioma:', error);
      throw error;
    }
  }

  export async function getDispersaoFrpMedioPorDia() {
    try {
      const response = await api.get('focos_calor/bioma/dispersao-frp-medio');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dispersão FRP médio por dia nos biomas:', error);
      throw error;
    }
  }

  export async function getTop5DiasMaisFocosPorBioma() {
    try {
      const response = await api.get('focos_calor/bioma/top5-dias-mais-focos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar top 5 dias com mais focos por bioma:', error);
      throw error;
    }
  }

  export async function getCrescimentoFocosDiariosTop5Biomas() {
    try {
      const response = await api.get('focos_calor/bioma/crescimento-focos-diarios-top5');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar crescimento de focos diários dos top 5 biomas:', error);
      throw error;
    }
  }

  export async function getMediaDiariaFocosBioma(biomaId: string) {
    try {
      const response = await api.get(`focos_calor/bioma/media-diaria/${biomaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar média diária de focos do bioma:', error);
      return []; // Return empty array instead of throwing
    }
  }

  export async function getEvolucaoHistoricaBioma(biomaId: string) {
    try {
      const response = await api.get(`focos_calor/bioma/evolucao-historica/${biomaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar evolução histórica do bioma:', error);
      return []; // Return empty array instead of throwing
    }
  }

  export async function refreshEstatisticasBioma() {
    try {
      const response = await api.post('focos_calor/bioma/refresh-estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas dos biomas:', error);
      throw error;
    }
  }

  // Additional biome-specific endpoints for better error handling
  export async function getKpiBiomaWithFallback() {
    try {
      const response = await api.get('focos_calor/bioma/kpi');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar KPI dos biomas:', error);
      return [];
    }
  }

  export async function getDistribuicaoFocosPorBiomaWithFallback() {
    try {
      const response = await api.get('focos_calor/bioma/distribuicao-focos');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar distribuição de focos por bioma:', error);
      return [];
    }
  }

  export async function getDispersaoFrpMedioPorDiaWithFallback() {
    try {
      const response = await api.get('focos_calor/bioma/dispersao-frp-medio');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar dispersão FRP médio por dia nos biomas:', error);
      return [];
    }
  }

  export async function getTop5DiasMaisFocosPorBiomaWithFallback() {
    try {
      const response = await api.get('focos_calor/bioma/top5-dias-mais-focos');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar top 5 dias com mais focos por bioma:', error);
      return [];
    }
  }

  export async function getCrescimentoFocosDiariosTop5BiomasWithFallback() {
    try {
      const response = await api.get('focos_calor/bioma/crescimento-focos-diarios-top5');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar crescimento de focos diários dos top 5 biomas:', error);
      return [];
    }
  }
