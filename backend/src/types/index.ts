export type AnalysisMode = 'mobilenet_v2_classifier' | 'gemini_vision_assisted';

export interface PlantClass {
  id: string;
  crop: string;
  disease: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Healthy' | 'Physiological';
  isHealthy: boolean;
}

export interface FavorableConditions {
  temperature: string;
  humidity: string;
  weather: string;
}

export interface DiseaseKnowledge {
  id: string;
  crop: string;
  disease_name: string;
  scientific_name?: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Healthy' | 'Physiological';
  severity_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  favorable_conditions: FavorableConditions;
  transmission_mode: string;
  prevention_measures: string[];
  organic_management: string[];
  ipm_recommendations: string[];
  when_to_seek_expert: string;
  sample_visual_markers: string[];
}

export interface CropCatalogItem {
  id: string;
  name: string;
  scientific_name: string;
  category: 'Cereal' | 'Nightshade' | 'Fruit' | 'Vegetable' | 'Legume';
  total_diseases_cataloged: number;
  sample_diseases: string[];
  icon: string;
  optimal_ph: string;
  growth_cycle_days: string;
}

export interface AlternativePrediction {
  crop_name: string;
  disease_name: string;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl?: string;
  imageFileName?: string;
  crop_name: string;
  predicted_class: string;
  disease_name: string;
  is_healthy: boolean;
  confidence: number;
  analysis_mode: AnalysisMode;
  confidence_calibrated: boolean;
  alternative_predictions: AlternativePrediction[];
  severity: 'None (Healthy)' | 'Low' | 'Moderate' | 'Severe' | 'Critical';
  severity_score?: number;
  observations: string[];
  diagnosis_summary: string;
  recommended_actions: string[];
  preventive_measures: string[];
  safe_crop_management: string[];
  expert_consultation_triggers: string[];
  sdg_impact_note: string;
  disclaimer: string;
}

export interface ServerHealthStatus {
  status: 'operational' | 'degraded';
  uptime_seconds: number;
  gemini_api_configured: boolean;
  gemini_model: string;
  ml_engine: {
    architecture: string;
    weights_status: 'embedded_feature_calibrated' | 'external_h5_loaded';
    classes_count: number;
    input_resolution: string;
  };
  database_status: string;
}

export interface PredictRequestBody {
  imageBase64: string;
  crop?: string;
  mode?: AnalysisMode;
  fileName?: string;
}

export interface AssistantRequestBody {
  question: string;
  cropContext?: string;
  history?: Array<{ role: string; content: string }>;
}
