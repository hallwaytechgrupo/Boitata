import { Router } from 'express';
import { AreaQueimadaController } from '../controllers/areaQueimada.controller';

const areaQueimadaRouter = Router();
const areaQueimadaController = new AreaQueimadaController();

areaQueimadaRouter.get('/estado/:estadoId', areaQueimadaController.getByEstado);

areaQueimadaRouter.get('/bioma/:biomaId', areaQueimadaController.getByBioma);

export default areaQueimadaRouter;
