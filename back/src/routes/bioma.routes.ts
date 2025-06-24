import { Router } from 'express';
import { FocoCalorController } from '../controllers/focoCalor.controller';
import { BiomaController } from '../controllers/bioma.controller';

const biomasRouter = Router();
const biomaController = new BiomaController();

biomasRouter.get('/', biomaController.getAllBiomas);

export default biomasRouter;
