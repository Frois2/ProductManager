import { httpClient } from "./httpClient";
import { API_CONFIG } from "@/config/api";
import { ProductComposition, CompositionRequest } from "@/types";

export class CompositionService {
  private static endpoint = API_CONFIG.ENDPOINTS.COMPOSITIONS;

  static async getAll(): Promise<ProductComposition[]> {
    const response = await httpClient.get<ProductComposition[]>(this.endpoint);
    return response.data;
  }

  static async getByProduct(productId: number): Promise<ProductComposition[]> {
    const response = await httpClient.get<ProductComposition[]>(
      `${this.endpoint}/product/${productId}`,
    );
    return response.data;
  }

  static async create(
    composition: CompositionRequest,
  ): Promise<ProductComposition> {
    const response = await httpClient.post<ProductComposition>(
      this.endpoint,
      composition,
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await httpClient.delete(`${this.endpoint}/${id}`);
  }
  static async update(
    id: number,
    data: { quantity: number },
  ): Promise<ProductComposition> {
    const response = await httpClient.patch<ProductComposition>(
      `${this.endpoint}/${id}`,
      data,
    );
    return response.data;
  }
}
