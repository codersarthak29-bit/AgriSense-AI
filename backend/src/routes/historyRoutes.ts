import { Router } from 'express';
import {
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
} from '../controllers/historyController.js';

const router = Router();

router.get('/', getHistory);
router.post('/', addHistoryItem);
router.delete('/:id', deleteHistoryItem);
router.post('/clear', clearHistory);

export default router;
