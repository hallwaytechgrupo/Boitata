import type { Request, Response } from 'express';
import { BiomaService } from '../services/bioma.service';

const biomaService = new BiomaService();

export class BiomaController {
  // Endpoint para buscar todos os biomas
  async getAllBiomas(req: Request, res: Response): Promise<void> {
    try {
      const biomas = await biomaService.getAllBiomasGeoJSON();
      res.json(biomas); // Retorna os dados diretamente
    } catch (error) {
      console.error('Erro ao buscar biomas:', error);
      res.status(500).send('Erro no servidor');
    }
  }
}
