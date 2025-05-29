export interface BaseError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiError extends BaseError {
  statusCode: number;
  details?: unknown;
}

// Network/Axios Error
export interface NetworkError extends BaseError {
  isNetworkError: true;
  originalError?: unknown;
}

export interface ValidationError extends BaseError {
  field?: string;
  validationCode?: string;
}

export interface AppError extends BaseError {
  type: "API" | "NETWORK" | "VALIDATION" | "UNKNOWN";
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
  statusCode?: number;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "statusCode" in error;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === "object" && error !== null && "isNetworkError" in error;
}

export function isValidationError(error: unknown): error is ValidationError {
  return typeof error === "object" && error !== null && "field" in error;
}

export function createApiError(message: string, statusCode: number, details?: unknown): ApiError {
  return {
    message,
    statusCode,
    details,
  };
}

export function createNetworkError(message: string, originalError?: unknown): NetworkError {
  return {
    message,
    isNetworkError: true,
    originalError,
  };
}

export function createValidationError(message: string, field?: string): ValidationError {
  return {
    message,
    field,
  };
}

// Utility function to extract error message safely
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  }

  return "An unknown error occurred";
}

export class AppErrorHandler {
  static normalize(error: Error | AppError | ApiError | NetworkError | ValidationError): AppError {
    if ("type" in error && error.type) {
      return error as AppError;
    }

    if (error instanceof Error) {
      return {
        type: "UNKNOWN",
        message: error.message,
      };
    }

    if (isApiError(error)) {
      return {
        type: "API",
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      };
    }

    if (isNetworkError(error)) {
      return {
        type: "NETWORK",
        message: error.message,
      };
    }

    if (isValidationError(error)) {
      return {
        type: "VALIDATION",
        message: error.message,
      };
    }

    return {
      type: "UNKNOWN",
      message: error.message || "An unknown error occurred",
    };
  }

  static getMessage(error: Error | AppError | string): string {
    if (typeof error === "string") {
      return error;
    }

    if ("message" in error) {
      return error.message;
    }

    return "An unknown error occurred";
  }
}

export function normalizeError(error: unknown): AppError {
  const message = getErrorMessage(error);

  if (isApiError(error)) {
    return {
      type: "API",
      message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (isNetworkError(error)) {
    return {
      type: "NETWORK",
      message,
    };
  }

  if (isValidationError(error)) {
    return {
      type: "VALIDATION",
      message,
    };
  }

  return {
    type: "UNKNOWN",
    message,
  };
}
