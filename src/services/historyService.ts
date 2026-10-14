import { AnalysisResult } from '../types';
import { request } from './apiClient';

export async function getHistory(): Promise<AnalysisResult[]> {
  try {
    return await request<AnalysisResult[]>('/api/history');
  } catch (e) {
    return [];
  }
}

export async function addHistoryItem(item: AnalysisResult): Promise<void> {
  await request('/api/history', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function deleteHistoryItem(id: string): Promise<void> {
  await request(`/api/history/${id}`, {
    method: 'DELETE',
  });
}

export async function clearHistory(): Promise<void> {
  await request('/api/history/clear', {
    method: 'POST',
  });
}
