import { AnalysisResult, AnalysisMode } from '../types';
import { compressImageIfNeeded } from '../utils/imageCompressor';
import { runClientSidePrediction } from '../utils/clientInferenceFallback';
import { request } from './apiClient';

export async function predict(
  imageBase64: string,
  crop?: string,
  mode?: AnalysisMode,
  fileName?: string
): Promise<AnalysisResult> {
  // 1. Optimize/compress image to guarantee payload is under 300KB
  let optimizedBase64 = imageBase64;
  try {
    optimizedBase64 = await compressImageIfNeeded(imageBase64);
  } catch (e) {
    console.warn('Image compression skipped:', e);
  }

  try {
    return await request<AnalysisResult>('/api/predict', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64: optimizedBase64,
        crop: crop || 'Auto-detect',
        mode: mode || 'mobilenet_v2_classifier',
        fileName: fileName || 'leaf_image.jpg',
      }),
    });
  } catch (err: any) {
    console.warn(`Server predict failed (${err.message}), falling back to browser inference...`);
    // Run reliable browser-side plant pathology fallback
    return runClientSidePrediction(optimizedBase64, crop, fileName);
  }
}
