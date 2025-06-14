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
}
