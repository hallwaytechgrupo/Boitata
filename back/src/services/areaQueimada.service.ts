import { format, parse } from 'date-fns';
import type { FeatureCollection } from '../types/FocoCalorEstado';
import { AreaQueimadaRepository } from '../repositories/AreaQueimadaRepository';

const toISO = (dateStr?: string) => {
  if (!dateStr) return undefined;
  // Aceita 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:mm:ss'
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr} 00:00:00`;
  }
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // fallback para outros formatos
  const parsed = parse(
    dateStr,
    dateStr.length > 10 ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy',
    new Date(),
  );
  return format(parsed, 'yyyy-MM-dd HH:mm:ss');
};

export class AreaQueimadaService {
  private repository = new AreaQueimadaRepository();

  async getByEstado(
    estadoId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    try {
      const startDate = toISO(dataInicio);
      const endDate = toISO(dataFim);

      // Verificar se o ID do estado é válido
      if (
        !estadoId ||
        Number.isNaN(Number(estadoId)) ||
        Number(estadoId) <= 0
      ) {
        throw new Error('ID do estado inválido');
      }

      return await this.repository.getAreaQueimadaByEstado(
        estadoId,
        startDate,
        endDate,
      );
    } catch (error) {
      console.error('Erro ao obter focos de calor por estado:', error);
      throw new Error('Erro ao obter focos de calor por estado');
    }
  }

  async getByBioma(
    biomaId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    try {
      const startDate = toISO(dataInicio);
      const endDate = toISO(dataFim);

      // Verificar se o ID do bioma é válido
      if (!biomaId || Number.isNaN(Number(biomaId)) || Number(biomaId) <= 0) {
        throw new Error('ID do bioma inválido');
      }

      return await this.repository.getAreaQueimadaByBioma(
        biomaId,
        startDate,
        endDate,
      );
    } catch (error) {
      console.error('Erro ao obter focos de calor por bioma:', error);
      throw new Error('Erro ao obter focos de calor por bioma');
    }
  }
  
  async getEstatisticasEstado(ano?: number, mes?: number): Promise<any[]> {
    try {
      return await this.repository.getEstatisticasEstado(ano, mes);
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do estado:', error);
      throw new Error('Erro ao buscar estatísticas do estado');
    }
  }

  /**
   * Retorna estatísticas de área queimada por bioma, agrupadas por ano e mês.
   * Pode filtrar por ano e mês.
   */
  async getEstatisticasBioma(ano?: number, mes?: number): Promise<Array<{
    ano: number;
    mes: number;
    bioma: string;
    area_queimada_km2: number;
  }>> {
    try {
      return await this.repository.getEstatisticasBioma(ano, mes);
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do bioma:', error);
      throw new Error('Erro ao buscar estatísticas do bioma');
    }
  }

  /**
   * Retorna o ranking dos estados por área queimada em km² e percentual nacional.
   * Pode filtrar por ano e limitar o número de resultados.
   */
  async getRankingEstadosAreaQueimada(
    ano?: number,
    limite: number = 10
  ): Promise<Array<{
    posicao: number;
    estado: string;
    area_total_km2: number;
    percentual_nacional: number;
  }>> {
    try {
      return await this.repository.getRankingEstadosAreaQueimada(ano, limite);
    } catch (error) {
      console.error('✗ Erro ao buscar ranking de estados por área queimada:', error);
      throw new Error('Erro ao buscar ranking de estados por área queimada');
    }
  }

  /**
   * Retorna o ranking dos municípios por área queimada em km² e percentual do estado.
   * Pode filtrar por ano, mês, estado e limitar o número de resultados.
   */
  async getAreaQueimadaPorMunicipio(
    ano?: number,
    mes?: number,
    estado?: string,
    limite: number = 20
  ): Promise<Array<{
    municipio: string;
    estado: string;
    area_queimada_km2: number;
    percentual_do_estado: number;
  }>> {
    try {
      return await this.repository.getAreaQueimadaPorMunicipio(ano, mes, estado, limite);
    } catch (error) {
      console.error('✗ Erro ao buscar ranking de municípios por área queimada:', error);
      throw new Error('Erro ao buscar ranking de municípios por área queimada');
    }
  }
}
