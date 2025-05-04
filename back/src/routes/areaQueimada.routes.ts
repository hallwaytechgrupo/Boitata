import { Router } from "express";
import { AreaQueimadaController } from "../controllers/areaQueimada.controller";

const areaQueimadaRouter = Router();
const areaQueimadaController = new AreaQueimadaController();

areaQueimadaRouter.get("/", areaQueimadaController.getAllAreaQueimada);

export default areaQueimadaRouter;
