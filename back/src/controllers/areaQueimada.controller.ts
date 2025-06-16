import type { Request, Response } from 'express';
import { AreaQueimadaService } from '../services/areaQueimada.service';

const areaQueimadaService = new AreaQueimadaService();

export class AreaQueimadaController {
  async getByBioma(req: Request, res: Response): Promise<void> {
    const { biomaId } = req.params;
    const { dataInicio, dataFim } = req.query;

    console.log('Parâmetros recebidos:', {
      biomaId,
      dataInicio,
      dataFim,
    });

    try {
      const areaQueimada = await areaQueimadaService.getByBioma(
        Number(biomaId),
        dataInicio ? String(dataInicio) : undefined,
        dataFim ? String(dataFim) : undefined,
      );

      res.json(areaQueimada);
    } catch (error) {
      console.error('Erro ao buscar focos de calor:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getByEstado(req: Request, res: Response): Promise<void> {
    const { estadoId } = req.params;
    const { dataInicio, dataFim } = req.query;

    console.log('Parâmetros recebidos:', {
      estadoId,
      dataInicio,
      dataFim,
    });

    try {
      const areaQueimada = await areaQueimadaService.getByEstado(
        Number(estadoId),
        dataInicio ? String(dataInicio) : undefined,
        dataFim ? String(dataFim) : undefined,
      );

      res.json(areaQueimada);
    } catch (error) {
      console.error('Erro ao buscar focos de calor:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getEstatisticasEstado(req: Request, res: Response): Promise<void> {
    const { ano, mes } = req.query;

    try {
      const estatisticas = await areaQueimadaService.getEstatisticasEstado(
        ano ? Number(ano) : undefined,
        mes ? Number(mes) : undefined
      );
      res.json(estatisticas);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do estado:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getEstatisticasBioma(req: Request, res: Response): Promise<void> {
    const { ano, mes } = req.query;

    try {
      const estatisticas = await areaQueimadaService.getEstatisticasBioma(
        ano ? Number(ano) : undefined,
        mes ? Number(mes) : undefined
      );
      res.json(estatisticas);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do bioma:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getRankingEstadosAreaQueimada(req: Request, res: Response): Promise<void> {
    const { ano, limite } = req.query;

    try {
      const ranking = await areaQueimadaService.getRankingEstadosAreaQueimada(
        ano ? Number(ano) : undefined,
        limite ? Number(limite) : 10
      );
      res.json(ranking);
    } catch (error) {
      console.error('Erro ao buscar ranking de estados por área queimada:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getAreaQueimadaPorMunicipio(req: Request, res: Response): Promise<void> {
    const { ano, mes, estado, limite } = req.query;

    try {
      const ranking = await areaQueimadaService.getAreaQueimadaPorMunicipio(
        ano ? Number(ano) : undefined,
        mes ? Number(mes) : undefined,
        estado ? String(estado) : undefined,
        limite ? Number(limite) : 20
      );
      res.json(ranking);
    } catch (error) {
      console.error('Erro ao buscar ranking de municípios por área queimada:', error);
      res.status(500).send('Erro no servidor');
    }
  }
}
