// src/api/apiClient.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Define response wrapper interface to match backend structure
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to unwrap the data from API response
apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse<any>>) => {
    // If the request was successful but the API indicates an error
    if (response.data && !response.data.success) {
      return Promise.reject(response.data.error);
    }
    
    // Include pagination info with the response data
    const result = response.data.data || null;
    // Add pagination property to the result if it exists
    if (response.data.pagination) {
      return {
        ...response,
        data: result,
        pagination: response.data.pagination
      };
    }
    
    return {
      ...response,
      data: result
    };
  },
  (error) => {
    // Handle error responses
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(error.response.data.error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;