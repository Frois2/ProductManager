import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RawMaterial } from '@/types';
import { RawMaterialService } from '@/services/rawMaterialService';
import toast from 'react-hot-toast';

interface RawMaterialState {
  items: RawMaterial[];
  loading: boolean;
  error: string | null;
  selectedMaterial: RawMaterial | null;
}

const initialState: RawMaterialState = {
  items: [],
  loading: false,
  error: null,
  selectedMaterial: null,
};

export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetchAll', async () => {
  return await RawMaterialService.getAll();
});

export const createRawMaterial = createAsyncThunk(
  'rawMaterials/create',
  async (rawMaterial: Omit<RawMaterial, 'id'>) => {
    const created = await RawMaterialService.create(rawMaterial);
    toast.success('Raw material created successfully');
    return created;
  }
);

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, data }: { id: number; data: Omit<RawMaterial, 'id'> }) => {
    const updated = await RawMaterialService.update(id, data);
    toast.success('Raw material updated successfully');
    return updated;
  }
);

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/delete',
  async (id: number) => {
    await RawMaterialService.delete(id);
    toast.success('Raw material deleted successfully');
    return id;
  }
);

const rawMaterialSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    setSelectedMaterial: (state, action: PayloadAction<RawMaterial | null>) => {
      state.selectedMaterial = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch raw materials';
      })
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export const { setSelectedMaterial, clearError } = rawMaterialSlice.actions;
export default rawMaterialSlice.reducer;