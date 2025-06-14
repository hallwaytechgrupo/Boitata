import { Request, Response } from 'express';
import { getDadosAreaQueimada, getDadosAreaQueimadaAgregados } from '../services/area.service';

export const getAreaQueimadaGeoJSON = async (req: Request, res: Response) => {
  try {
    const dados = await getDadosAreaQueimada();

    if (!dados || dados.length === 0) {
      res.status(404).json({ erro: 'Nenhum dado de área queimada encontrado.' }); // sem 
    }
    const response = [];

    for (var i = 0; i < 10; i++) {
      if (dados[i]) {
        // Convertendo geometria para GeoJSON
        const geometry = JSON.parse(dados[i].st_asgeojson);
        response.push({ geometry, type: 'Feature', properties: {} });
      } else {
        console.warn(`Dado ${i} não possui geometria válida.`);
      }
    }

    res.status(200).send({
      type: 'FeatureCollection',
      features: response,
    });
  } catch (error: any) {
    console.error('Erro ao obter dados de área queimada:', error.message);
    res.status(500).json({ erro: 'Erro ao obter dados de área queimada.' }); // sem return
  }
};

export const getAreaQueimadaStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDadosAreaQueimadaAgregados(req.query);
    res.json(stats); // sem return
  } catch (error: any) {
    console.error('Erro ao obter estatísticas de área queimada:', error.message);
    res.status(500).json({ erro: 'Erro ao obter estatísticas de área queimada.' }); // sem return
  }
};

