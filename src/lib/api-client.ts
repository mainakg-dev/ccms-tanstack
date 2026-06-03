import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

export class AppError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.data = data;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Assuming cookies are used for sessions/tokens
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const message = error.response?.data
      ? (error.response.data as any).message || error.message
      : error.message;
    const status = error.response?.status || 500;

    if (status === 401) {
    }

    return Promise.reject(new AppError(message, status, error.response?.data));
  },
);

export default apiClient;
