import { httpClient } from './httpClient';
import { API_CONFIG } from '@/config/api';
import { Product } from '@/types';

export class ProductService {
  private static endpoint = API_CONFIG.ENDPOINTS.PRODUCTS;

  static async getAll(): Promise<Product[]> {
    const response = await httpClient.get<Product[]>(this.endpoint);
    return response.data;
  }

  static async getById(id: number): Promise<Product> {
    const response = await httpClient.get<Product>(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async create(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await httpClient.post<Product>(this.endpoint, product);
    return response.data;
  }

  static async update(id: number, product: Omit<Product, 'id'>): Promise<Product> {
    const response = await httpClient.put<Product>(`${this.endpoint}/${id}`, product);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await httpClient.delete(`${this.endpoint}/${id}`);
  }
}