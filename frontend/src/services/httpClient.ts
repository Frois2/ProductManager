import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';
import toast from 'react-hot-toast';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Check your connection');
    }
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const httpClient = new HttpClient().getInstance();