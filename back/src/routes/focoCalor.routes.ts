import { Router } from "express";
import { FocoCalorController } from "../controllers/focoCalor.controller";

const focoCalorRouter = Router();
const focoCalorController = new FocoCalorController();

focoCalorRouter.get("/estado/:estadoId", focoCalorController.getFocosByEstado);

export default focoCalorRouter;
