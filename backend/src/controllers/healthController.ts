import { Request, Response } from 'express';
import { isGeminiConfigured } from '../config/gemini.js';
import { PLANT_CLASSES } from '../data/plantClasses.js';
import { historyService } from '../services/historyService.js';
import { ServerHealthStatus } from '../types/index.js';

export function getHealth(req: Request, res: Response<ServerHealthStatus>): void {
  const status: ServerHealthStatus = {
    status: 'operational',
    uptime_seconds: Math.floor(process.uptime()),
    gemini_api_configured: isGeminiConfigured(),
    gemini_model: 'gemini-3.8-flash',
    ml_engine: {
      architecture: 'MobileNetV2 (Transfer Learning with ImageNet & PlantVillage calibration)',
      weights_status: 'embedded_feature_calibrated',
      classes_count: PLANT_CLASSES.length,
      input_resolution: '224x224 RGB',
    },
    database_status: `JSON persistence active (${historyService.getCount()} records)`,
  };

  res.json(status);
}
