import axios from 'axios';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fetchMunicipios = async (): Promise<any[]> => {
  try {
    console.log('Buscando dados dos municípios...');
    const response = await axios.get(
      'http://servicodados.ibge.gov.br/api/v1/localidades/municipios',
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar ou salvar dados dos municípios:', error);
    return [];
  }
};
