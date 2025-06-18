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
  '/estado/basicInfo/:estadoId',
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

// Rotas específicas para KPIs e gráficos de Estado

focoCalorRouter.get('/estado/estatisticas-final/:estadoId', (req, res) => {focoCalorController.getEstatisticasEstadoFinal(req, res)}
);

focoCalorRouter.get(
  '/estado/kpi-total-focos/:estadoId',
  (req, res) => {focoCalorController.getKpiTotalFocosEstado(req, res)}
);

focoCalorRouter.get(
  '/estado/kpi-mes-maior-focos/:estadoId',
  (req, res) => {focoCalorController.getKpiMesMaiorFocos(req, res)}
);

focoCalorRouter.get(
  '/estado/kpi-risco-medio/:estadoId',
  (req, res) => {focoCalorController.getKpiRiscoMedioEstado(req, res)}
);

focoCalorRouter.get(
  '/estado/kpi-focos-por-satelite/:estadoId',
  (req, res) => {focoCalorController.getKpiFocosPorSatelite(req, res)}
);

focoCalorRouter.get(
  '/estado/grafico-evolucao-temporal/:estadoId',
  (req, res) => {focoCalorController.getGraficoEvolucaoTemporal(req, res)}
);

focoCalorRouter.get(
  '/estado/grafico-comparacao-satelite/:estadoId',
  (req, res) => {focoCalorController.getGraficoComparacaoSatelite(req, res)}
);

focoCalorRouter.get(
  '/estado/grafico-distribuicao/:estadoId',
  (req, res) => {focoCalorController.getGraficoDistribuicaoEstado(req, res)}
);

focoCalorRouter.get(
  '/estado/grafico-correlacao-risco-focos/:estadoId',
  (req, res) => {focoCalorController.getGraficoCorrelacaoRiscoFocos(req, res)}
);

export default focoCalorRouter;
