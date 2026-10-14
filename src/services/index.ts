export * from './apiClient';
export * from './healthService';
export * from './cropService';
export * from './diseaseService';
export * from './predictionService';
export * from './historyService';
export * from './assistantService';

import { getHealth } from './healthService';
import { getCrops } from './cropService';
import { getDiseases } from './diseaseService';
import { predict } from './predictionService';
import { getHistory, addHistoryItem, deleteHistoryItem, clearHistory } from './historyService';
import { askAssistant } from './assistantService';

export const api = {
  getHealth,
  getCrops,
  getDiseases,
  predict,
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  askAssistant,
};

export default api;
