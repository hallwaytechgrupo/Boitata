// back/src/controllers/area.controller.ts
import { Request, Response } from 'express';
import { filtrarDadosPorPoligonoService } from '../services/area.service';

export const filtrarPorPoligonoController = async (req: Request, res: Response) => {
  try {
    const { coordenadas } = req.body;

    if (!coordenadas || !Array.isArray(coordenadas) || coordenadas.length < 3) {
      return res.status(400).json({ erro: 'Coordenadas inválidas.' });
    }

    const dadosFiltrados = await filtrarDadosPorPoligonoService(coordenadas);

    return res.json(dadosFiltrados);
  } catch (erro: any) {
    console.error('Erro ao filtrar por polígono:', erro.message);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};