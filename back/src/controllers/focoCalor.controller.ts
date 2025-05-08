import type { Request, Response } from "express";
import { FocoCalorService } from "../services/focoCalor.service";

const focoCalorService = new FocoCalorService();

export class FocoCalorController {
  async getGraficoData(req: Request, res: Response): Promise<void> {
    const { ano, mes } = req.query;

    try {
      const graficoData = await focoCalorService.getGraficoData(
        ano ? Number(ano) : undefined,
        mes ? Number(mes) : undefined
      );

      console;

      res.json(graficoData);
    } catch (error) {
      console.error("Erro ao buscar dados para gráfico:", error);
      res.status(500).send("Erro no servidor");
    }
  }

  async getFocosByEstado(req: Request, res: Response): Promise<void> {
    const { estadoId } = req.params;

    try {
      const focos = await focoCalorService.getFocosByEstado(Number(estadoId));
      res.json(focos);
    } catch (error) {
      console.error("Erro ao buscar focos de calor:", error);
      res.status(500).send("Erro no servidor");
    }
  }

  async getFocosByBioma(req: Request, res: Response): Promise<void> {
    const { biomaId } = req.params;

    try {
      const focos = await focoCalorService.getFocosByBioma(Number(biomaId));

      res.json(focos);
    } catch (error) {
      console.error("Erro ao buscar focos de calor:", error);
      res.status(500).send("Erro no servidor");
    }
  }

  async getBasicInfoByEstado(req: Request, res: Response): Promise<void> {
    const { estadoId } = req.params;

    try {
      const info = await focoCalorService.getBasicInfoByEstado(
        Number(estadoId)
      );

      res.json(info);
    } catch (error) {
      console.error("Erro ao buscar informações básicas:", error);
      res.status(500).send("Erro no servidor");
    }
  }
}
