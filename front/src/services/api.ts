import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

/**
 * Busca dados para o gráfico de focos de calor por estado com filtros de mês e ano
 * @param mes O mês para filtrar (1-12)
 * @param ano O ano para filtrar
 * @returns Dados formatados para exibição no gráfico
 */
export const getGraficoFocosCalor = async (mes: number, ano: number) => {
  try {
    const response = await api.get("focos_calor/grafico", {
      params: {
        mes,
        ano,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados para gráfico:", error);
    throw error;
  }
};

export const getFocosCalorByEstadoId = async (estadoId: string) => {
  try {
    const response = await api.get(`focos_calor/estado/${estadoId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching focosCalor:", error);
    throw error;
  }
};

export const getFocosByBioamId = async (biomaId: string) => {
  try {
    const response = await api.get(`focos_calor/bioma/${biomaId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching focosCalor:", error);
    throw error;
  }
};

export const getStateInfo = async (estadoId: string) => {
  try {
    const response = await api.get(`focos_calor/estado/info/${estadoId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching stateInfo:", error);
    throw error;
  }
};

export const getBiomasShp = async () => {
  try {
    const response = await api.get("biomas");

    return response.data;
  } catch (error) {
    console.error("Error fetching focosCalor:", error);
    throw error;
  }
};
