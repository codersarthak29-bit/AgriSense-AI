import { Request, Response } from 'express';
import { cropService } from '../services/cropService.js';
import { CropCatalogItem } from '../types/index.js';

export function getCrops(req: Request, res: Response<CropCatalogItem[]>): void {
  const crops = cropService.getAllCrops();
  res.json(crops);
}

export function getCropById(req: Request, res: Response<CropCatalogItem | { error: string }>): void {
  const { id } = req.params;
  const crop = cropService.getCropById(id);
  if (!crop) {
    res.status(404).json({ error: `Crop with id '${id}' not found` });
    return;
  }
  res.json(crop);
}
