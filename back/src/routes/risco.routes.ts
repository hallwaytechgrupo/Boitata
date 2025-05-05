import { Router } from "express";
import { RiscoController } from "../controllers/risco.controller";

const riscoRoutes = Router();
const riscoController = new RiscoController();

riscoRoutes.get("/", riscoController.getAllRisco);

export default riscoRoutes;
