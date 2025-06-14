import express from 'express';
import { getAreaQueimadaGeoJSON, getAreaQueimadaStats } from '../controllers/areaQueimada.controller'; // Ajuste o caminho

const router = express.Router();

router.get('/dados-area-queimada', getAreaQueimadaGeoJSON); // Rota para dados do mapa
router.get('/estatisticas-area-queimada', getAreaQueimadaStats); // Rota para gráficos/estatísticas

export default router;