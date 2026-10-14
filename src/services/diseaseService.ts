import { DiseaseInfo } from '../types';
import { request } from './apiClient';

export async function getDiseases(query?: string, crop?: string, category?: string): Promise<DiseaseInfo[]> {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (crop) params.append('crop', crop);
  if (category) params.append('category', category);

  const url = `/api/diseases${params.toString() ? `?${params.toString()}` : ''}`;
  return await request<DiseaseInfo[]>(url);
}
