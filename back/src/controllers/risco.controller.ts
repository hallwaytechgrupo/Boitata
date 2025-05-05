import type { Request, Response } from "express";
import { RiscoService } from "../services/risco.service";

const riscoService = new RiscoService();

export class RiscoController {
  async getAllRisco(req: Request, res: Response): Promise<any> {
    const { estadoId } = req.params;

    try {
      const risco = await riscoService.getAllRisco();
      res.json(risco);
    } catch (error) {
      console.error("Erro ao buscar risco:", error);
      res.status(500).send("Erro no servidor");
    }
  }
}
