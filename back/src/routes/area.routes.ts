// back/src/routes/area.routes.ts
import express from 'express';
import { filtrarPorPoligonoController } from '../controllers/area.controller';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();
router.post(
  '/filtrar-area',
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure the controller returns a promise and handles errors
    Promise.resolve(filtrarPorPoligonoController(req, res))
      .catch(next);
  }
);

export default router;