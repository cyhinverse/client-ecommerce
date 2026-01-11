/**
 * Centralized Error Handler Service
 * Provides consistent error handling across the application
 */

import { toast } from 'sonner';

/**
 * Standard API error structure
 */
export interface ApiError {
  message: string;
  code?: number;
  field?: string;
}

/**
 * Options for error logging
 */
export interface ErrorHandlerOptions {
  /** Suppress console output */
  silent?: boolean;
  /** Context identifier for the error */
  context?: string;
}

/**
 * Extract error message from various error formats
 */
function extractError(error: unknown): ApiError {
  // Handle null/undefined
  if (error === null || error === undefined) {
    return {
      message: 'Đã xảy ra lỗi, vui lòng thử lại sau',
      code: 500,
    };
  }

  // Handle axios error structure
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        code?: number;
        field?: string;
        status?: string;
      };
      status?: number;
    };
    message?: string;
  };

  // Try to get message from response data first
  if (axiosError?.response?.data?.message) {
    return {
      message: axiosError.response.data.message,
      code: axiosError.response.data.code || axiosError.response.status,
      field: axiosError.response.data.field,
    };
  }

  // Fall back to error message
  if (axiosError?.message) {
    return {
      message: axiosError.message,
      code: axiosError.response?.status,
    };
  }

  // Handle Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 500,
    };
  }

  // Default error
  return {
    message: 'Đã xảy ra lỗi, vui lòng thử lại sau',
    code: 500,
  };
}

/**
 * Centralized error handler
 */
export const errorHandler = {
  /**
   * Log error to console (suppressed in production)
   */
  log(error: unknown, options: ErrorHandlerOptions = {}): void {
    if (process.env.NODE_ENV !== 'production' && !options.silent) {
      const context = options.context ? `[${options.context}]` : '[Error]';
      console.error(`${context}:`, error);
    }
    // Future: Send to error tracking service (Sentry, etc.)
  },

  /**
   * Extract structured error from unknown error
   */
  extract(error: unknown): ApiError {
    return extractError(error);
  },

  /**
   * Log error and show toast notification
   */
  notify(error: unknown, message?: string): void {
    const apiError = extractError(error);
    toast.error(message || apiError.message);
  },

  /**
   * Log error with context and optionally notify user
   */
  handle(
    error: unknown,
    options: ErrorHandlerOptions & { notify?: boolean; notifyMessage?: string } = {}
  ): ApiError {
    const apiError = extractError(error);
    
    this.log(error, options);
    
    if (options.notify) {
      toast.error(options.notifyMessage || apiError.message);
    }
    
    return apiError;
  },
};

export default errorHandler;
