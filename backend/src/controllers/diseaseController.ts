import { Request, Response } from 'express';
import { diseaseService } from '../services/diseaseService.js';
import { DiseaseKnowledge } from '../types/index.js';

export function getDiseases(req: Request, res: Response<DiseaseKnowledge[]>): void {
  const query = (req.query.q as string) || '';
  const crop = (req.query.crop as string) || '';
  const category = (req.query.category as string) || '';

  const results = diseaseService.searchDiseases({ query, crop, category });
  res.json(results);
}

export function getDiseaseById(
  req: Request,
  res: Response<DiseaseKnowledge | { error: string }>
): void {
  const { id } = req.params;
  const disease = diseaseService.getDiseaseById(id);
  if (!disease) {
    res.status(404).json({ error: `Disease with id '${id}' not found` });
    return;
  }
  res.json(disease);
}
