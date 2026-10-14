import fs from 'fs';
import { ENV } from '../config/env.js';
import { AnalysisResult } from '../types/index.js';

const defaultDemoRecords: AnalysisResult[] = [
  {
    id: 'demo-rec-1',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    crop_name: 'Tomato',
    predicted_class: 'tomato_early_blight',
    disease_name: 'Early Blight (Alternaria solani)',
    is_healthy: false,
    confidence: 0.942,
    analysis_mode: 'mobilenet_v2_classifier',
    confidence_calibrated: true,
    alternative_predictions: [
      { crop_name: 'Tomato', disease_name: 'Septoria Leaf Spot', confidence: 0.038 },
      { crop_name: 'Tomato', disease_name: 'Target Spot', confidence: 0.012 },
    ],
    severity: 'Moderate',
    severity_score: 58,
    observations: [
      'Concentric brown target-like lesions visible on lower leaf lobe',
      'Chlorotic yellow halos surrounding necrotic spot centers',
      'Leaf margin curl observed near distal leaflet',
    ],
    diagnosis_summary: 'Classic presentation of Alternaria solani (Early Blight) on lower foliage.',
    recommended_actions: [
      'Prune out the lowest affected leaves immediately and dispose away from the field',
      'Avoid wetting foliage during irrigation; irrigate strictly at the root line',
      'Apply an organic copper-based protectant or bio-fungicide (Bacillus subtilis)',
    ],
    preventive_measures: [
      'Spread straw or compost mulch 5 cm thick to stop soil splashback',
      'Rotate with non-solanaceous crops for next season',
      'Increase plant spacing to improve canopy ventilation',
    ],
    safe_crop_management: [
      'Do not apply synthetic fungicides within 14 days of fruit harvest',
      'Sterilize pruning shears between rows with 70% ethanol',
    ],
    expert_consultation_triggers: [
      'If dark lesions extend to the main stem collar',
      'If more than 35% of total plant foliage shows lesions within 5 days',
    ],
    sdg_impact_note: 'Targeted early intervention prevents unnecessary chemical spraying (SDG 12) and safeguards tomato harvest yield (SDG 2).',
    disclaimer: 'AgriSense AI predictions provide supportive guidance and should be verified with field agronomists.',
  },
  {
    id: 'demo-rec-2',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    crop_name: 'Corn (Maize)',
    predicted_class: 'corn_common_rust',
    disease_name: 'Common Rust (Puccinia sorghi)',
    is_healthy: false,
    confidence: 0.915,
    analysis_mode: 'mobilenet_v2_classifier',
    confidence_calibrated: true,
    alternative_predictions: [
      { crop_name: 'Corn (Maize)', disease_name: 'Gray Leaf Spot', confidence: 0.052 },
      { crop_name: 'Corn (Maize)', disease_name: 'Healthy', confidence: 0.021 },
    ],
    severity: 'Low',
    severity_score: 28,
    observations: [
      'Scattered cinnamon-brown powdery pustules on adaxial leaf surface',
      'No coalesced blighting or severe vascular collapse present',
    ],
    diagnosis_summary: 'Early-stage Common Rust observed with limited pustule coverage.',
    recommended_actions: [
      'Monitor rust pustule coverage every 3 days; currently below economic spray threshold',
      'Check upper leaves near the ear leaf as the crop approaches tasseling',
    ],
    preventive_measures: [
      'Ensure balanced nitrogen fertilization; avoid excess nitrogen',
      'Note resistant hybrid varieties for future seasonal planting',
    ],
    safe_crop_management: [
      'Do not spray chemical fungicides when disease pressure is below the economic injury level',
    ],
    expert_consultation_triggers: [
      'If pustules cover more than 5% of leaf area on the ear leaf before silking',
    ],
    sdg_impact_note: 'Prevented premature chemical fungicide application, reducing agrochemical runoff (SDG 15).',
    disclaimer: 'Calibrated classifier result on MobileNetV2 architecture. Field evaluation recommended.',
  },
  {
    id: 'demo-rec-3',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    crop_name: 'Potato',
    predicted_class: 'potato_healthy',
    disease_name: 'Healthy',
    is_healthy: true,
    confidence: 0.978,
    analysis_mode: 'mobilenet_v2_classifier',
    confidence_calibrated: true,
    alternative_predictions: [
      { crop_name: 'Potato', disease_name: 'Early Blight', confidence: 0.015 },
      { crop_name: 'Potato', disease_name: 'Late Blight', confidence: 0.005 },
    ],
    severity: 'None (Healthy)',
    severity_score: 0,
    observations: [
      'Uniform green pigmentation across leaf blade',
      'Intact leaf margins and crisp vascular venation',
      'No necrotic lesions, water-soaking, or chlorosis detected',
    ],
    diagnosis_summary: 'Healthy potato canopy showing robust vegetative vigor.',
    recommended_actions: [
      'Maintain current scouting and balanced irrigation schedule',
      'Hill soil around plants to protect developing tubers from sun and spores',
    ],
    preventive_measures: [
      'Continue regular field walk-throughs twice a week',
      'Inspect lowest leaf layer during cool, foggy mornings for any late blight risk',
    ],
    safe_crop_management: [
      'Apply organic compost tea root drench to sustain microbial soil diversity',
    ],
    expert_consultation_triggers: [
      'Only if regional Late Blight alerts are issued by local meteorological extension',
    ],
    sdg_impact_note: 'Documenting verified healthy status avoids prophylactic pesticide use (SDG 12).',
    disclaimer: 'Image evaluated against PlantVillage potato pathology parameters.',
  },
];

class HistoryService {
  private cache: AnalysisResult[] = [];
  private filePath: string;

  constructor() {
    this.filePath = ENV.HISTORY_FILE_PATH;
    this.cache = this.loadFromFile();
  }

  private loadFromFile(): AnalysisResult[] {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('⚠️ Error reading history file:', err);
    }
    return [...defaultDemoRecords];
  }

  private saveToFile(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error('⚠️ Error saving history file:', err);
    }
  }

  public getAll(): AnalysisResult[] {
    return this.cache;
  }

  public getCount(): number {
    return this.cache.length;
  }

  public add(item: AnalysisResult): void {
    this.cache.unshift(item);
    if (this.cache.length > 50) {
      this.cache.pop();
    }
    this.saveToFile();
  }

  public delete(id: string): boolean {
    const prevLength = this.cache.length;
    this.cache = this.cache.filter((h) => h.id !== id);
    if (this.cache.length !== prevLength) {
      this.saveToFile();
      return true;
    }
    return false;
  }

  public clear(): void {
    this.cache = [];
    this.saveToFile();
  }
}

export const historyService = new HistoryService();
