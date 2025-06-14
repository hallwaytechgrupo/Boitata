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
}
