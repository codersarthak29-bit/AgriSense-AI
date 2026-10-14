import { Request, Response } from 'express';
import { isGeminiConfigured } from '../config/gemini.js';
import { aiService } from '../services/aiService.js';
import { classifierService } from '../services/classifierService.js';
import { historyService } from '../services/historyService.js';
import { AnalysisResult, PredictRequestBody } from '../types/index.js';

export async function predictPlantDisease(
  req: Request<{}, {}, PredictRequestBody>,
  res: Response<AnalysisResult | { error: string }>
): Promise<void> {
  try {
    const { imageBase64, crop, mode, fileName } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Image data is required as a base64 encoded string' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const requestedMode = mode === 'gemini_vision_assisted' ? 'gemini_vision_assisted' : 'mobilenet_v2_classifier';

    let result: AnalysisResult;

    // 1. Try Gemini Vision if requested and configured
    if (requestedMode === 'gemini_vision_assisted' && isGeminiConfigured()) {
      try {
        result = await aiService.analyzeLeafImage(imageBase64, crop, fileName);
      } catch (geminiErr: any) {
        console.warn('Gemini vision call failed, falling back to MobileNetV2 classifier:', geminiErr?.message);
        result = classifierService.classify(crop, cleanBase64, fileName);
      }
    } else {
      // 2. Standard MobileNetV2 calibrated classifier path
      result = classifierService.classify(crop, cleanBase64, fileName);
    }

    result.imageFileName = fileName || 'leaf_scan.jpg';
    if (imageBase64.length < 200000) {
      result.imageUrl = imageBase64;
    }

    // 3. Save to persistent history
    historyService.add(result);

    res.json(result);
  } catch (err: any) {
    console.error('Prediction controller error:', err);
    res.status(500).json({ error: 'Failed to process plant image: ' + (err.message || 'Unknown error') });
  }
}
