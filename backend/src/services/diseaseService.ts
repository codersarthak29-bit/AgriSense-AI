import { DISEASE_KNOWLEDGE_BASE } from '../data/diseaseKnowledge.js';
import { DiseaseKnowledge } from '../types/index.js';

export interface DiseaseFilterOptions {
  query?: string;
  crop?: string;
  category?: string;
}

export class DiseaseService {
  public getAllDiseases(): DiseaseKnowledge[] {
    return DISEASE_KNOWLEDGE_BASE;
  }

  public getDiseaseById(id: string): DiseaseKnowledge | undefined {
    return DISEASE_KNOWLEDGE_BASE.find((d) => d.id === id);
  }

  public searchDiseases(filters: DiseaseFilterOptions): DiseaseKnowledge[] {
    let results = [...DISEASE_KNOWLEDGE_BASE];

    if (filters.crop && filters.crop.toLowerCase() !== 'all') {
      const cropQuery = filters.crop.toLowerCase();
      results = results.filter((d) => d.crop.toLowerCase().includes(cropQuery));
    }

    if (filters.category && filters.category.toLowerCase() !== 'all') {
      const catQuery = filters.category.toLowerCase();
      results = results.filter((d) => d.category.toLowerCase() === catQuery);
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (d) =>
          d.disease_name.toLowerCase().includes(q) ||
          d.crop.toLowerCase().includes(q) ||
          d.symptoms.some((s) => s.toLowerCase().includes(q)) ||
          d.transmission_mode.toLowerCase().includes(q)
      );
    }

    return results;
  }
}

export const diseaseService = new DiseaseService();
