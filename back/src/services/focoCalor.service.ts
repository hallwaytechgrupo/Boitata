import { format, parse } from 'date-fns';
import { query } from '../config/database';
import type { FeatureCollection } from '../types/FocoCalorEstado';
import type { EstatisticasEstado } from '../types/Statics';
import { FocosCalorRepository } from '../repositories/FocosCalorRepository';

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

export class FocoCalorService {
  private repository = new FocosCalorRepository();

  async getGraficoData_old(
    ano?: number,
    mes?: number,
  ): Promise<
    {
      ano: number;
      mes: number;
      id_estado: number;
      numero_focos_calor: number;
    }[]
  > {
    const conditions: string[] = [];
    const params: (number | string)[] = [];

    if (ano !== undefined) {
      params.push(ano);
      conditions.push(`EXTRACT(YEAR FROM f.data_hora) = $${params.length}`);
    }

    if (mes !== undefined) {
      params.push(mes);
      conditions.push(`EXTRACT(MONTH FROM f.data_hora) = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryText = `
      SELECT 
        EXTRACT(YEAR FROM f.data_hora)::integer AS ano,
        EXTRACT(MONTH FROM f.data_hora)::integer AS mes,
        e.id_estado,
        COUNT(f.id_foco)::integer AS numero_focos_calor
      FROM 
        tb_focos_calor f
      JOIN 
        tb_municipios m ON f.id_municipio = m.id_municipio
      JOIN 
        tb_estados e ON m.id_estado = e.id_estado
      ${whereClause}
      GROUP BY 
        ano, mes, e.id_estado
      ORDER BY 
        ano, mes
    `;

    const result = await query(queryText, params);

    return result.rows.map((row) => ({
      ano: Number.parseInt(row.ano),
      mes: Number.parseInt(row.mes),
      id_estado: Number.parseInt(row.id_estado),
      numero_focos_calor: Number.parseInt(row.numero_focos_calor),
    }));
  }

  async getGraficoData(
    ano?: number,
    mes?: number,
  ): Promise<
    {
      ano: number;
      mes: number;
      id_estado: number;
      numero_focos_calor: number;
    }[]
  > {
    return this.repository.getGraficoDataPorAnoMes(ano, mes);
  }

  async getFocosByMunicipio(
    municipioId: string,
    dataInicio?: string,
    dataFim?: string,
  ) {
    const inicio = toISO(dataInicio);
    const fim = toISO(dataFim);

    return await this.repository.getFocosByMunicipioId(
      municipioId,
      inicio,
      fim,
    );
  }

  async getFocosByEstado(
    estadoId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    const inicio = toISO(dataInicio);
    const fim = toISO(dataFim);

    return this.repository.getFocosByEstado(estadoId, inicio, fim);
  }

  async getFocosByBioma(
    biomaId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<FeatureCollection> {
    const result = await query(
      'SELECT * FROM get_focos_geojson_bioma($1, $2, $3)',
      [biomaId, dataInicio ?? null, dataFim ?? null],
    );

    if (result.rowCount === 0 || !result.rows[0]?.get_focos_geojson_bioma) {
      return { type: 'FeatureCollection', features: [] };
    }

    return result.rows[0].get_focos_geojson_bioma as FeatureCollection;
  }

  async getBasicInfoByEstado(estadoId: number): Promise<EstatisticasEstado> {
    const result = await query(
      'SELECT * FROM v_estatisticas_estado_final WHERE id_estado = $1',
      [estadoId],
    );

    if (result.rowCount === 0) {
      return {
        id_estado: estadoId,
        estado: '',
        top_cidades: [],
        maior_frp: {
          municipio: 'Nenhum dado disponível',
          frp: 0,
          data: '',
        },
        ultima_atualizacao: new Date().toISOString(),
      };
    }

    const row = result.rows[0];

    return {
      id_estado: row.id_estado,
      estado: row.estado,
      top_cidades: row.top_cidades || [],
      maior_frp: row.maior_frp || {
        municipio: 'Nenhum dado disponível',
        frp: 0,
        data: '',
      },
      ultima_atualizacao: row.ultima_atualizacao,
    };
  }

  async getEstatisticasBioma(biomaId?: number) {
    try {
      return await this.repository.getEstatisticasBioma(biomaId);
    } catch (error) {
      console.error('Erro no serviço de estatísticas do bioma:', error);
      throw error;
    }
  }

  async getEstatisticasMunicipio(municipioId?: number) {
    try {
      return await this.repository.getEstatisticasMunicipio(municipioId);
    } catch (error) {
      console.error('Erro no serviço de estatísticas do município:', error);
      throw error;
    }
  }

  async getEstatisticasEstado(estadoId?: number) {
    try {
      return await this.repository.getEstatisticasEstado(estadoId);
    } catch (error) {
      console.error('Erro no serviço de estatísticas do estado:', error);
      throw error;
    }
  }

  // Método adicional para buscar um resumo geral para o dashboard
  async getResumoDashboard() {
    try {
      const biomas = await this.repository.getEstatisticasBioma();
      const totalFocos = biomas.reduce(
        (acc: any, bioma: { total_focos_30dias: any }) =>
          acc + bioma.total_focos_30dias,
        0,
      );
      const biomasMaisAfetados = biomas
        .sort(
          (
            a: { total_focos_30dias: number },
            b: { total_focos_30dias: number },
          ) => b.total_focos_30dias - a.total_focos_30dias,
        )
        .slice(0, 3)
        .map(
          (b: { id_bioma: any; bioma: any; total_focos_30dias: number }) => ({
            id: b.id_bioma,
            bioma: b.bioma,
            total: b.total_focos_30dias,
            percentual: ((b.total_focos_30dias / totalFocos) * 100).toFixed(1),
          }),
        );

      // Buscar os estados mais afetados
      const estados = await this.repository.getEstatisticasEstado();
      const estadosMaisAfetados = estados
        .sort(
          (
            a: { total_focos_30dias: number },
            b: { total_focos_30dias: number },
          ) => b.total_focos_30dias - a.total_focos_30dias,
        )
        .slice(0, 5);

      return {
        totalFocos,
        biomasMaisAfetados,
        estadosMaisAfetados,
      };
    } catch (error) {
      console.error('Erro ao buscar resumo do dashboard:', error);
      throw error;
    }
  }
}
