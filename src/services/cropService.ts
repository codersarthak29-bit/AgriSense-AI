import { CropCatalogItem } from '../types';
import { request } from './apiClient';

const FALLBACK_CROPS: CropCatalogItem[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'Nightshade',
    total_diseases_cataloged: 9,
    sample_diseases: ['Early Blight', 'Late Blight', 'Bacterial Spot', 'Yellow Leaf Curl', 'Septoria'],
    icon: '🍅',
    optimal_ph: '6.0 - 6.8',
    growth_cycle_days: '65 - 85 days',
  },
  {
    id: 'potato',
    name: 'Potato',
    scientific_name: 'Solanum tuberosum',
    category: 'Nightshade',
    total_diseases_cataloged: 3,
    sample_diseases: ['Early Blight', 'Late Blight', 'Blackleg'],
    icon: '🥔',
    optimal_ph: '5.2 - 6.4',
    growth_cycle_days: '90 - 120 days',
  },
  {
    id: 'corn',
    name: 'Corn (Maize)',
    scientific_name: 'Zea mays',
    category: 'Cereal',
    total_diseases_cataloged: 4,
    sample_diseases: ['Common Rust', 'Gray Leaf Spot', 'Northern Leaf Blight'],
    icon: '🌽',
    optimal_ph: '5.8 - 7.0',
    growth_cycle_days: '60 - 100 days',
  },
  {
    id: 'apple',
    name: 'Apple',
    scientific_name: 'Malus domestica',
    category: 'Fruit',
    total_diseases_cataloged: 4,
    sample_diseases: ['Apple Scab', 'Black Rot', 'Cedar Apple Rust'],
    icon: '🍎',
    optimal_ph: '6.0 - 7.0',
    growth_cycle_days: 'Perennial',
  },
  {
    id: 'grape',
    name: 'Grape',
    scientific_name: 'Vitis vinifera',
    category: 'Fruit',
    total_diseases_cataloged: 4,
    sample_diseases: ['Black Rot', 'Esca (Black Measles)', 'Leaf Blight'],
    icon: '🍇',
    optimal_ph: '5.5 - 6.5',
    growth_cycle_days: 'Perennial',
  },
  {
    id: 'pepper',
    name: 'Bell Pepper',
    scientific_name: 'Capsicum annuum',
    category: 'Nightshade',
    total_diseases_cataloged: 2,
    sample_diseases: ['Bacterial Spot', 'Phytophthora Blight'],
    icon: '🫑',
    optimal_ph: '6.2 - 7.0',
    growth_cycle_days: '70 - 90 days',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    scientific_name: 'Fragaria × ananassa',
    category: 'Fruit',
    total_diseases_cataloged: 2,
    sample_diseases: ['Leaf Scorch', 'Angular Leaf Spot'],
    icon: '🍓',
    optimal_ph: '5.5 - 6.5',
    growth_cycle_days: '60 - 90 days',
  },
  {
    id: 'rice',
    name: 'Rice',
    scientific_name: 'Oryza sativa',
    category: 'Cereal',
    total_diseases_cataloged: 3,
    sample_diseases: ['Rice Blast', 'Brown Spot', 'Bacterial Blight'],
    icon: '🌾',
    optimal_ph: '5.5 - 6.5',
    growth_cycle_days: '105 - 150 days',
  },
];

export async function getCrops(): Promise<CropCatalogItem[]> {
  try {
    return await request<CropCatalogItem[]>('/api/crops');
  } catch (err) {
    console.warn('Using client crop catalog fallback');
    return FALLBACK_CROPS;
  }
}
