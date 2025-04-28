import { fetchMunicipios } from './api/fetchMunicipios';
import { saveToTypescriptFile } from './file/saveToFile';

interface MunicipioIBGE {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

const processMunicipios = async () => {
  try {
    const municipios = await fetchMunicipios();

    const processedMunicipios = municipios.map((municipio: MunicipioIBGE) => ({
      id_municipio: municipio.id,
      municipio: municipio.nome,
      id_estado: municipio.microrregiao.mesorregiao.UF.id,
    }));

    saveToTypescriptFile('../utils/id_cidades.ts', {
      municipios: processedMunicipios,
    });
  } catch (error) {
    console.error('Erro ao processar municípios:', error);
  }
};

processMunicipios();
