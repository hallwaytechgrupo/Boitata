import { Router, Request, Response, NextFunction } from "express";
import { RiscoFogoController } from "../controllers/riscoFogoController";

const router = Router();
const controller = new RiscoFogoController();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn.call(controller, req, res, next)).catch(next);
  };
}

router.get(
  "/geojson/estado/:estadoId",
  asyncHandler(controller.getGeoJsonByEstado)
);
router.get(
  "/geojson/bioma/:biomaId",
  asyncHandler(controller.getGeoJsonPorBiomas)
);

export default router;
