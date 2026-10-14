import { CROP_CATALOG } from '../data/crops.js';
import { CropCatalogItem } from '../types/index.js';

export class CropService {
  public getAllCrops(): CropCatalogItem[] {
    return CROP_CATALOG;
  }

  public getCropById(id: string): CropCatalogItem | undefined {
    return CROP_CATALOG.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  public getCropByName(name: string): CropCatalogItem | undefined {
    const clean = name.toLowerCase();
    return CROP_CATALOG.find((c) => c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase()));
  }
}

export const cropService = new CropService();
