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
    console.error('Error fetching focosCalor:', error);
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
