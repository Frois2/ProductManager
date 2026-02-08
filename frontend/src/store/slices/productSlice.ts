import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';
import { ProductService } from '@/services/productService';
import toast from 'react-hot-toast';

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await ProductService.getAll();
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: Omit<Product, 'id'>) => {
    const created = await ProductService.create(product);
    toast.success('Product created successfully');
    return created;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Omit<Product, 'id'> }) => {
    const updated = await ProductService.update(id, data);
    toast.success('Product updated successfully');
    return updated;
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await ProductService.delete(id);
  toast.success('Product deleted successfully');
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;