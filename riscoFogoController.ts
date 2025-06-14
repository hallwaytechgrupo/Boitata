import { Request, Response, NextFunction } from "express";
import { RiscoFogoService } from "../services/riscoFogo.service";

const riscoFogoService = new RiscoFogoService();

export class RiscoFogoController {
  /**
   * Consulta risco de fogo em formato GeoJSON para o mapa por estado
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   * @param next - Função de próxima rota
   */
  async getGeoJsonByEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const estadoId = parseInt(req.params.estadoId, 10);
      if (isNaN(estadoId)) {
        return res.status(400).json({ error: "Parâmetro estadoId inválido" });
      }

      const page = parseInt(req.query.page as string, 10) || 1; // Página atual (padrão: 1)
      const limit = parseInt(req.query.limit as string, 10) || 100; // Limite de registros por página (padrão: 100)
      const offset = (page - 1) * limit; // Calcula o deslocamento

      const geojson = await riscoFogoService.getGeoJsonByEstadoPaginated(
        estadoId,
        limit,
        offset
      );
      res.json(geojson);
    } catch (error) {
      console.error(
        "Erro ao buscar GeoJSON de risco de fogo por estado:",
        error
      );
      next(error);
    }
  }

  async getGeoJsonPorBiomas(req: Request, res: Response, next: NextFunction) {
    try {
      const biomaId = parseInt(req.params.biomaId, 10); // Obtém o biomaId da URL
      if (isNaN(biomaId)) {
        return res.status(400).json({ error: "Parâmetro biomaId inválido" });
      }

      const geojson = await riscoFogoService.getGeoJsonPorBiomas(biomaId);
      res.json(geojson);
    } catch (error) {
      console.error(
        "Erro ao buscar GeoJSON de risco de fogo por biomas:",
        error
      );
      next(error);
    }
  }

  async getMaterializedViewBiomas(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await riscoFogoService.getMaterializedViewBiomas();
      res.json(data);
    } catch (error) {
      console.error("Erro ao buscar materialized view de biomas:", error);
      next(error);
    }
  }
}
