import { httpClient } from './httpClient';
import { API_CONFIG } from '@/config/api';
import { RawMaterial } from '@/types';

export class RawMaterialService {
  private static endpoint = API_CONFIG.ENDPOINTS.RAW_MATERIALS;

  static async getAll(): Promise<RawMaterial[]> {
    const response = await httpClient.get<RawMaterial[]>(this.endpoint);
    return response.data;
  }

  static async getById(id: number): Promise<RawMaterial> {
    const response = await httpClient.get<RawMaterial>(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async create(rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> {
    const response = await httpClient.post<RawMaterial>(this.endpoint, rawMaterial);
    return response.data;
  }

  static async update(id: number, rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> {
    const response = await httpClient.put<RawMaterial>(
      `${this.endpoint}/${id}`,
      rawMaterial
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await httpClient.delete(`${this.endpoint}/${id}`);
  }
}