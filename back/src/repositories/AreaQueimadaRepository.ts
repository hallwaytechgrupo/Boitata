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
}
