import { Router } from 'express';
import { askAssistant } from '../controllers/assistantController.js';

const router = Router();

router.post('/ask', askAssistant);

export default router;
