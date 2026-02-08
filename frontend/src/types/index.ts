export interface Product {
  id?: number;
  name: string;
  price: number;
}

export interface RawMaterial {
  id?: number;
  name: string;
  stockQuantity: number;
}

export interface ProductComposition {
  id?: number;
  product: Product;
  rawMaterial: RawMaterial;
  quantityRequired: number;
}

export interface CompositionRequest {
  productId: number;
  rawMaterialId: number;
  quantity: number;
}

export interface ProductionPlan {
  productName: string;
  quantityToProduce: number;
  totalValue: number;
}

export interface ApiError {
  message: string;
  status?: number;
}