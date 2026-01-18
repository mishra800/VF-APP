import { API_CONFIG, HTTP_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

class HttpService {
  private static instance: HttpService;
  
  static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Replace path parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }
    
    return url;
  }

  async request<T>(
    endpoint: string, 
    options: RequestOptions = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      requiresAuth = true,
    } = options;

    const url = this.buildUrl(endpoint, pathParams);
    
    const requestHeaders = {
      ...HTTP_CONFIG.headers,
      ...headers,
      ...(requiresAuth ? await this.getAuthHeaders() : {}),
    };

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, pathParams?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, pathParams);
  }

  async post<T>(endpoint: string, body: any, pathParams?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body }, pathParams);
  }

  async put<T>(endpoint: string, body: any, pathParams?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body }, pathParams);
  }

  async delete<T>(endpoint: string, pathParams?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, pathParams);
  }
}

export default HttpService;