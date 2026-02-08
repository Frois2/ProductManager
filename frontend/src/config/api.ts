export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    PRODUCTS: '/products',
    RAW_MATERIALS: '/raw-materials',
    COMPOSITIONS: '/compositions',
    PLANNING: '/planning',
  },
  TIMEOUT: 10000,
} as const;