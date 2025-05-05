// Importações dos modelos necessários para o repositório
import { EstadoModel } from "../models/EstadoModel";
import { MunicipioModel } from "../models/MunicipioModel";
import { FocoCalorModel } from "../models/FocoCalorModel";
import { AreaQueimadaModel } from "../models/AreaQueimadaModel";
import { RiscoModel } from "../models/RiscoModel";

import { query } from "../config/database"

// Classe responsável pelo acesso aos dados no banco de dados
export class DataRepository {
  // Método assíncrono que retorna todos os estados
  // Promise<EstadoModel[]> indica que este método retornará uma promessa
  // que, quando resolvida, conterá um array de objetos EstadoModel
  async getEstados(): Promise<EstadoModel[]> {
    // Aqui seria implementada a lógica de conexão com o banco de dados
    // e execução da consulta SQL para buscar todos os estados
    // Por enquanto, retorna um array vazio como placeholder
    return [];
  }

  // Método para buscar municípios de um determinado estado
  // Recebe o ID do estado como parâmetro
  // Retorna uma promessa de array de MunicipioModel
  async getMunicipiosByEstado(estadoId: number): Promise<MunicipioModel[]> {
    // Aqui seria implementada a consulta SQL filtrando por estado_id
    // Exemplo de SQL: SELECT * FROM tb_municipios WHERE estado_id = $1
    return [];
  }

  // Método para buscar focos de calor em um determinado município
  // Recebe o ID do município como parâmetro
  // Retorna uma promessa de array de FocoCalorModel
  async getFocosByMunicipio(municipioId: number): Promise<FocoCalorModel[]> {
    // Aqui seria implementada a consulta SQL filtrando por municipio_id
    // Exemplo de SQL: SELECT * FROM tb_focos_calor WHERE municipio_id = $1
    return [];
  }

  // Método para buscar áreas queimadas em um determinado período
  // Recebe datas de início e fim como parâmetros
  // Retorna uma promessa de array de AreaQueimadaModel
  async getAreaQueimadaByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<AreaQueimadaModel[]> {
    // Aqui seria implementada a consulta SQL filtrando pelo período
    // Exemplo de SQL: SELECT * FROM tb_area_queimada
    // WHERE mes_referencia BETWEEN $1 AND $2
    return [];
  }

  // Método para buscar todos os focos de calor
  async getAllAreaQueimada(): Promise<any> {
    return await query("SELECT * FROM tb_area_queimada")
  }

  // Método para buscar todos os focos de calor
  async getAllRisco(): Promise<any> {
    return await query("SELECT * FROM tb_focos_calor")
  }
}
