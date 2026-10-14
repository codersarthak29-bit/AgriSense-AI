import { Router } from 'express';
import { getCrops, getCropById } from '../controllers/cropController.js';

const router = Router();

router.get('/', getCrops);
router.get('/:id', getCropById);

export default router;
