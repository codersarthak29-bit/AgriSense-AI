import { Request, Response } from 'express';
import { historyService } from '../services/historyService.js';
import { AnalysisResult } from '../types/index.js';

export function getHistory(req: Request, res: Response<AnalysisResult[]>): void {
  res.json(historyService.getAll());
}

export function addHistoryItem(req: Request, res: Response<{ success: boolean; count: number } | { error: string }>): void {
  const item = req.body as AnalysisResult;
  if (!item || !item.crop_name) {
    res.status(400).json({ error: 'Invalid history record payload' });
    return;
  }
  historyService.add(item);
  res.json({ success: true, count: historyService.getCount() });
}

export function deleteHistoryItem(req: Request, res: Response<{ success: boolean; count: number }>): void {
  const { id } = req.params;
  historyService.delete(id);
  res.json({ success: true, count: historyService.getCount() });
}

export function clearHistory(req: Request, res: Response<{ success: boolean; count: number }>): void {
  historyService.clear();
  res.json({ success: true, count: 0 });
}
