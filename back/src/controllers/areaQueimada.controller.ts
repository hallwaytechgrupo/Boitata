import type { Request, Response } from "express";
import { AreaQueimadaService } from "../services/areaQueimada.service";

const areaQueimadaService = new AreaQueimadaService();

export class AreaQueimadaController {
  async getAllAreaQueimada(req: Request, res: Response): Promise<any> {
    const { estadoId } = req.params;

    try {
      const areaQueimada = await areaQueimadaService.getAllAreaQueimada();
      res.json(areaQueimada);
    } catch (error) {
      console.error("Erro ao buscar areaQueimada:", error);
      res.status(500).send("Erro no servidor");
    }
  }
}
