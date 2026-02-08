import { httpClient } from './httpClient';
import { API_CONFIG } from '@/config/api';
import { ProductionPlan } from '@/types';

export class PlanningService {
  private static endpoint = API_CONFIG.ENDPOINTS.PLANNING;

  static async getProductionPlan(): Promise<ProductionPlan[]> {
    const response = await httpClient.get<ProductionPlan[]>(this.endpoint);
    return response.data;
  }
}