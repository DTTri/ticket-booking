import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";
import { ErrorHandler } from "@/utils/errorHandler";

export interface BaseServiceConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableAuth?: boolean;
}

export interface RetryConfig {
  attempts: number;
  delay: number;
  backoffFactor: number;
}

class BaseService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly prefixUrl: string;
  private readonly retryConfig: RetryConfig;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (_value?: unknown) => void;
    reject: (_reason?: unknown) => void;
  }> = [];

  constructor(prefixUrl?: string, config?: BaseServiceConfig) {
    this.prefixUrl = prefixUrl || "";

    const defaultConfig: Required<BaseServiceConfig> = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableAuth: true,
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.retryConfig = {
      attempts: finalConfig.retryAttempts,
      delay: finalConfig.retryDelay,
      backoffFactor: 2,
    };

    this.axiosInstance = axios.create({
      baseURL: `${finalConfig.baseURL}${this.prefixUrl}`,
      timeout: finalConfig.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (finalConfig.enableAuth) {
      this.setupInterceptors();
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = Cookies.get("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Token added to headers");
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized: expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.axiosInstance(originalRequest))
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = Cookies.get("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const response = await this.axiosInstance.post("/account/refresh-token", {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            Cookies.set("token", accessToken);

            this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            this.processQueue(null);
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            // Cookies.remove("token");
            // Cookies.remove("refreshToken");
            // window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    this.failedQueue = [];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    attempt = 1
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt >= this.retryConfig.attempts) {
        throw ErrorHandler.fromCatch(error);
      }

      // Only retry on network errors or 5xx server errors
      const axiosError = error as AxiosError;
      const shouldRetry =
        !axiosError.response ||
        (axiosError.response.status >= 500 && axiosError.response.status < 600);

      if (!shouldRetry) {
        throw ErrorHandler.fromCatch(error);
      }

      const delayMs =
        this.retryConfig.delay * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
      await this.delay(delayMs);

      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.get<T>(url, config));
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.post<T>(url, data, config));
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.put<T>(url, data, config));
  }

  protected async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.patch<T>(url, data, config));
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.delete<T>(url, config));
  }
}

export default BaseService;
