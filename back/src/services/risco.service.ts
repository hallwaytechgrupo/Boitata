import { DataRepository } from "../repositories/DataRepository"; // Importa o repositório de dados, se necessário

const dataRepository = new DataRepository(); // Instancia o repositório de dados, se necessário
export class RiscoService {

  async getAllRisco(): Promise<any> {
    const result = await dataRepository.getAllRisco();

    return result;
  }


}
