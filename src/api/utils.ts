/**
 * API Response Utilities
 * Provides consistent patterns for handling API responses across the application
 */

/**
 * Standard API response structure from server
 */
export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message: string;
  code: number;
  data: T;
}

/**
 * Pagination metadata structure
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Standard error structure for Redux actions
 */
export interface ApiError {
  message: string;
  code?: number;
  field?: string;
}

/**
 * Type guard to check if response has nested data structure
 */
function hasNestedData<T>(data: unknown): data is ApiResponse<T> {
  return (
    data !== null &&
    typeof data === "object" &&
    "data" in data &&
    "status" in data
  );
}

/**
 * Extract data from API response consistently
 * Handles both nested (response.data.data) and flat (response.data) structures
 */
export function extractApiData<T>(response: { data: ApiResponse<T> | T }): T {
  const data = response.data;
  
  if (hasNestedData<T>(data)) {
    return data.data;
  }
  
  return data as T;
}

/**
 * Extract paginated data from API response
 */
export function extractPaginatedData<T>(
  response: { data: ApiResponse<PaginatedResponse<T>> | PaginatedResponse<T> }
): PaginatedResponse<T> {
  const data = response.data;
  
  if (hasNestedData<PaginatedResponse<T>>(data)) {
    return data.data;
  }
  
  return data as PaginatedResponse<T>;
}

/**
 * Extract error message from API error response
 */
export function extractApiError(error: unknown): ApiError {
  if (error === null || error === undefined) {
    return {
      message: "Đã xảy ra lỗi, vui lòng thử lại sau",
      code: 500,
    };
  }

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

  if (axiosError?.response?.data?.message) {
    return {
      message: axiosError.response.data.message,
      code: axiosError.response.data.code || axiosError.response.status,
      field: axiosError.response.data.field,
    };
  }

  if (axiosError?.message) {
    return {
      message: axiosError.message,
      code: axiosError.response?.status,
    };
  }

  return {
    message: "Đã xảy ra lỗi, vui lòng thử lại sau",
    code: 500,
  };
}

/**
 * Common error messages mapping for localization
 */
export const ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  CATEGORY_NOT_FOUND: "Không tìm thấy danh mục",
  UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện thao tác này",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ",
  SERVER_ERROR: "Đã xảy ra lỗi, vui lòng thử lại sau",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  TIMEOUT: "Yêu cầu quá thời gian chờ",
};

/**
 * Get localized error message
 */
export function getLocalizedError(code: string, fallback?: string): string {
  return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES.SERVER_ERROR;
}
