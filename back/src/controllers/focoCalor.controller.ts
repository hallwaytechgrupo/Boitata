import type { Request, Response } from "express";
import { FocoCalorService } from "../services/focoCalor.service";

const focoCalorService = new FocoCalorService();

export class FocoCalorController {
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
}
