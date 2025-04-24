import { Router } from "express";
import { FocoCalorController } from "../controllers/focoCalor.controller";

const focoCalorRouter = Router();
const focoCalorController = new FocoCalorController();

focoCalorRouter.get("/estado/:estadoId", focoCalorController.getFocosByEstado);
focoCalorRouter.get("/bioma/:biomaId", focoCalorController.getFocosByBioma);
focoCalorRouter.get(
	"/estado/info/:estadoId",
	focoCalorController.getBasicInfoByEstado,
);

export default focoCalorRouter;
