import { Router } from 'express';
import { AreaQueimadaController } from '../controllers/areaQueimada.controller';

const areaQueimadaRouter = Router();
const areaQueimadaController = new AreaQueimadaController();

areaQueimadaRouter.get('/estado/:estadoId', areaQueimadaController.getByEstado);

areaQueimadaRouter.get('/bioma/:biomaId', areaQueimadaController.getByBioma);

areaQueimadaRouter.get('/info/estado', areaQueimadaController.getEstatisticasEstado);
areaQueimadaRouter.get('/info/bioma', areaQueimadaController.getEstatisticasBioma);
areaQueimadaRouter.get('/ranking/estados', areaQueimadaController.getRankingEstadosAreaQueimada);

export default areaQueimadaRouter;
