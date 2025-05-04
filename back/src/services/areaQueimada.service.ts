import { DataRepository } from "../repositories/DataRepository"; // Importa o repositório de dados, se necessário

const dataRepository = new DataRepository(); // Instancia o repositório de dados, se necessário
export class AreaQueimadaService {

  async getAllAreaQueimada(): Promise<any> {
    const result = await dataRepository.getAllAreaQueimada();

    return result;
  }


}
