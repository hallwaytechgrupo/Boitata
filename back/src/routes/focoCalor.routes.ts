import { Router } from 'express';
import { FocoCalorController } from '../controllers/focoCalor.controller';

const focoCalorRouter = Router();
const focoCalorController = new FocoCalorController();

focoCalorRouter.get('/municipio/:municipioId', (req, res) => {
  focoCalorController.getFocosByMunicipioId(req, res);
});
focoCalorRouter.get('/estado/:estadoId', focoCalorController.getFocosByEstado);
focoCalorRouter.get('/bioma/:biomaId', focoCalorController.getFocosByBioma);
focoCalorRouter.get('/grafico', focoCalorController.getGraficoData);
focoCalorRouter.get(
  '/estado/info/:estadoId',
  focoCalorController.getBasicInfoByEstado,
);

focoCalorRouter.get('/municipio/info/:municipioId', (req, res) => {
  focoCalorController.getEstatisticasMunicipio(req, res);
});

focoCalorRouter.get('/estado/info/:estadoId', (req, res) => {
  focoCalorController.getEstatisticasEstado(req, res);
});

focoCalorRouter.get('/bioma/info/:biomaId', (req, res) => {
  focoCalorController.getEstatisticasBioma(req, res);
});

focoCalorRouter.get('/dashboard', (req, res) => {
  focoCalorController.getDashboardResumo(req, res);
});

export default focoCalorRouter;
