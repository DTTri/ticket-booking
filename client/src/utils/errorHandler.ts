import { AxiosError } from "axios";
import {
  ApiError,
  NetworkError,
  AppError,
  ApiErrorResponse,
  createApiError,
  createNetworkError,
  AppErrorHandler,
} from "@/types/errors";

export class ErrorHandler {
  static handleAxiosError(error: AxiosError): ApiError | NetworkError {
    if (!error.response) {
      return createNetworkError(error.message || "Network error occurred", error);
    }

    // API error (response received with error status)
    const response = error.response;
    const data = response.data as ApiErrorResponse;

    const message = data?.message || data?.error || error.message || "API error occurred";
    const statusCode = response.status;

    return createApiError(message, statusCode, data?.details);
  }

  static handleStandardError(error: Error): AppError {
    return AppErrorHandler.normalize(error);
  }

  static handle(error: Error | AxiosError): ApiError | NetworkError | AppError {
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }

    return this.handleStandardError(error);
  }

  static log(error: AppError | ApiError | NetworkError, context?: string): void {
    const prefix = context ? `[${context}]` : "";

    if ("statusCode" in error && error.statusCode !== undefined) {
      // API Error
      if (error.statusCode >= 500) {
        console.error(`${prefix} Server Error:`, error.message, error);
      } else if (error.statusCode >= 400) {
        console.warn(`${prefix} Client Error:`, error.message, error);
      } else {
        console.warn(`${prefix} API Error:`, error.message, error);
      }
    } else if ("isNetworkError" in error) {
      // Network Error
      console.error(`${prefix} Network Error:`, error.message, error);
    } else {
      // Generic Error
      console.error(`${prefix} Error:`, error.message, error);
    }
  }

  static handleServiceError(error: Error | AxiosError, context: string): never {
    const normalizedError = this.handle(error);
    this.log(normalizedError, context);
    throw normalizedError;
  }

  static handleAsyncThunkError(error: Error | AxiosError): string {
    const normalizedError = this.handle(error);
    return normalizedError.message;
  }

  static handleUnknown(error: unknown): Error | AxiosError {
    // Type guard for AxiosError
    if (error && typeof error === "object" && "isAxiosError" in error) {
      return error as AxiosError;
    }

    // Type guard for Error
    if (error instanceof Error) {
      return error;
    }

    // Convert anything else to a standard Error
    const message = typeof error === "string" ? error : "An unknown error occurred";
    return new Error(message);
  }

  /**
   * Universal handler for catch blocks - converts unknown to typed error
   */
  static fromCatch(error: unknown): ApiError | NetworkError | AppError {
    const typedError = this.handleUnknown(error);
    return this.handle(typedError);
  }

  /**
   * Service error handler for catch blocks
   */
  static handleServiceErrorFromCatch(error: unknown, context: string): never {
    const typedError = this.handleUnknown(error);
    return this.handleServiceError(typedError, context);
  }

  /**
   * Async thunk error handler for catch blocks
   */
  static handleAsyncThunkErrorFromCatch(error: unknown): string {
    const typedError = this.handleUnknown(error);
    return this.handleAsyncThunkError(typedError);
  }
}

export function handleAxiosError(error: AxiosError): ApiError | NetworkError {
  return ErrorHandler.handleAxiosError(error);
}

export function handleAsyncThunkError(error: unknown): string {
  return ErrorHandler.handleAsyncThunkErrorFromCatch(error);
}

export function logError(error: AppError | ApiError | NetworkError, context?: string): void {
  ErrorHandler.log(error, context);
}

export function handleServiceError(error: unknown, context: string): never {
  return ErrorHandler.handleServiceErrorFromCatch(error, context);
}
