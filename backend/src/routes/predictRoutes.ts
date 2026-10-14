import { Router } from 'express';
import { predictPlantDisease } from '../controllers/predictController.js';

const router = Router();

router.post('/', predictPlantDisease);

export default router;
