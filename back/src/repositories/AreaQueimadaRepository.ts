import type { ClientBase } from 'pg';
import fs from 'node:fs';
import { from as copyFrom } from 'pg-copy-streams';
import { query } from '../config/database';
import console from 'node:console';
import type { FeatureCollection } from '../types/FocoCalorEstado';

export class AreaQueimadaRepository {
  /**
   * Retorna os focos de calor em formato GeoJSON para um bioma específico
   */
  async getAreaQueimadaByEstado(
    estadoId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    console.log('getAreaQueimadaByEstado', {
      estadoId,
      dataInicio,
      dataFim,
    });

    const result = await query(
      'SELECT * FROM get_area_queimada_by_estado($1, $2, $3)',
      [estadoId, dataInicio ?? null, dataFim ?? null],
    );

    console.log('getAreaQueimadaByEstado result', result);

    if (result.rowCount === 0 || !result.rows[0]?.get_area_queimada_by_estado) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_area_queimada_by_estado as FeatureCollection;
  }

  /**
   * Retorna os focos de calor em formato GeoJSON para um bioma específico
   */
  async getAreaQueimadaByBioma(
    biomaId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    console.log('getAreaQueimadaByBioma', {
      biomaId,
      dataInicio,
      dataFim,
    });

    const result = await query(
      'SELECT * FROM get_area_queimada_by_bioma($1, $2, $3)',
      [biomaId, dataInicio ?? null, dataFim ?? null],
    );

    console.log('getAreaQueimadaByBioma result', result);

    if (result.rowCount === 0 || !result.rows[0]?.get_area_queimada_by_bioma) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_area_queimada_by_bioma as FeatureCollection;
  }

  /**
   * Retorna estatísticas de área queimada por estado, agrupadas por ano e mês.
   * Pode filtrar por ano e mês.
   */
  async getEstatisticasEstado(ano?: number, mes?: number): Promise<any[]> {
    try {
      const result = await query(
        'SELECT * FROM get_grafico_area_queimada_estado($1, $2)',
        [ano ?? null, mes ?? null]
      );
      return result.rows;
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do estado:', error);
      throw error;
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
      const result = await query(
        'SELECT * FROM get_grafico_area_queimada_bioma($1, $2)',
        [ano ?? null, mes ?? null]
      );
      return result.rows as Array<{
        ano: number;
        mes: number;
        bioma: string;
        area_queimada_km2: number;
      }>;
    } catch (error) {
      console.error('✗ Erro ao buscar estatísticas do bioma:', error);
      throw error;
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
      const result = await query(
        'SELECT * FROM get_ranking_estados_area_queimada($1, $2)',
        [ano ?? null, limite]
      );
      return result.rows as Array<{
        posicao: number;
        estado: string;
        area_total_km2: number;
        percentual_nacional: number;
      }>;
    } catch (error) {
      console.error('✗ Erro ao buscar ranking de estados por área queimada:', error);
      throw error;
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
      const result = await query(
        'SELECT * FROM get_area_queimada_por_municipio($1, $2, $3, $4)',
        [ano ?? null, mes ?? null, estado ?? null, limite]
      );
      return result.rows as Array<{
        municipio: string;
        estado: string;
        area_queimada_km2: number;
        percentual_do_estado: number;
      }>;
    } catch (error) {
      console.error('✗ Erro ao buscar ranking de municípios por área queimada:', error);
      throw error;
    }
  }
}
