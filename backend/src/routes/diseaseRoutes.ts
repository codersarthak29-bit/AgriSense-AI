import { Router } from 'express';
import { getDiseases, getDiseaseById } from '../controllers/diseaseController.js';

const router = Router();

router.get('/', getDiseases);
router.get('/:id', getDiseaseById);

export default router;
