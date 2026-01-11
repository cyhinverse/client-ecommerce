/**
 * Property-based tests for API response utilities
 * Feature: code-cleanup-audit
 * Property 1: API Response Extraction Consistency
 * Validates: Requirements 2.1, 7.1, 7.5, 12.1
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  extractApiData,
  extractPaginatedData,
  extractApiError,
  getLocalizedError,
  ERROR_MESSAGES,
  type ApiResponse,
  type PaginatedResponse,
} from "@/api";

describe("extractApiData", () => {
  /**
   * Property 1: API Response Extraction Consistency
   * For any API response, extractApiData should correctly extract the data payload
   * regardless of whether the response is nested or flat.
   */
  
  it("should extract data consistently from nested responses", () => {
    fc.assert(
      fc.property(
        fc.anything(),
        (data) => {
          const nestedResponse = {
            data: {
              status: "success" as const,
              message: "OK",
              code: 200,
              data,
            },
          };
          const result = extractApiData(nestedResponse);
          return JSON.stringify(result) === JSON.stringify(data);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should extract data consistently from flat responses", () => {
    fc.assert(
      fc.property(
        // Use primitives and simple objects to avoid nested data structure confusion
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.array(fc.string()),
          fc.dictionary(fc.string(), fc.string())
        ),
        (data) => {
          // Flat response without status field
          const flatResponse = { data };
          const result = extractApiData(flatResponse);
          return JSON.stringify(result) === JSON.stringify(data);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle null data in nested response", () => {
    const response = {
      data: {
        status: "success" as const,
        message: "OK",
        code: 200,
        data: null,
      },
    };
    expect(extractApiData(response)).toBeNull();
  });

  it("should handle undefined data in nested response", () => {
    const response = {
      data: {
        status: "success" as const,
        message: "OK",
        code: 200,
        data: undefined,
      },
    };
    expect(extractApiData(response)).toBeUndefined();
  });

  it("should handle array data in nested response", () => {
    const products = [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }];
    const response = {
      data: {
        status: "success" as const,
        message: "OK",
        code: 200,
        data: products,
      },
    };
    expect(extractApiData(response)).toEqual(products);
  });

  it("should handle object data in nested response", () => {
    const product = { id: 1, name: "Product 1", price: 100 };
    const response = {
      data: {
        status: "success" as const,
        message: "OK",
        code: 200,
        data: product,
      },
    };
    expect(extractApiData(response)).toEqual(product);
  });
});

describe("extractPaginatedData", () => {
  it("should extract paginated data from nested response", () => {
    const paginatedData: PaginatedResponse<{ id: number }> = {
      data: [{ id: 1 }, { id: 2 }],
      pagination: {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
      },
    };
    
    const response = {
      data: {
        status: "success" as const,
        message: "OK",
        code: 200,
        data: paginatedData,
      },
    };
    
    const result = extractPaginatedData(response);
    expect(result.data).toEqual(paginatedData.data);
    expect(result.pagination).toEqual(paginatedData.pagination);
  });

  it("should extract paginated data from flat response", () => {
    const paginatedData: PaginatedResponse<{ id: number }> = {
      data: [{ id: 1 }, { id: 2 }],
      pagination: {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
      },
    };
    
    const response = { data: paginatedData };
    
    const result = extractPaginatedData(response);
    expect(result.data).toEqual(paginatedData.data);
    expect(result.pagination).toEqual(paginatedData.pagination);
  });

  /**
   * Property: Pagination structure consistency
   * For any paginated response, the extracted data should maintain pagination structure
   */
  it("should maintain pagination structure for any valid pagination values", () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 1000 }), // page
        fc.nat({ max: 100 }),  // limit
        fc.nat({ max: 10000 }), // total
        fc.array(fc.dictionary(fc.string(), fc.string()), { maxLength: 20 }), // data
        (page, limit, total, data) => {
          const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
          const paginatedData: PaginatedResponse<Record<string, string>> = {
            data,
            pagination: { page, limit, total, totalPages },
          };
          
          const response = {
            data: {
              status: "success" as const,
              message: "OK",
              code: 200,
              data: paginatedData,
            },
          };
          
          const result = extractPaginatedData(response);
          return (
            result.pagination.page === page &&
            result.pagination.limit === limit &&
            result.pagination.total === total &&
            result.pagination.totalPages === totalPages &&
            result.data.length === data.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("extractApiError", () => {
  /**
   * Property 2: Error Handling Pattern Consistency
   * For any error, extractApiError should return a structured ApiError object
   * with at minimum a message field.
   */
  
  it("should always return an object with message field", () => {
    fc.assert(
      fc.property(
        fc.anything(),
        (error) => {
          const result = extractApiError(error);
          return typeof result.message === "string" && result.message.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should extract message from axios error response", () => {
    const error = {
      response: {
        data: {
          message: "Product not found",
          code: 404,
        },
        status: 404,
      },
    };
    
    const result = extractApiError(error);
    expect(result.message).toBe("Product not found");
    expect(result.code).toBe(404);
  });

  it("should extract field from validation error", () => {
    const error = {
      response: {
        data: {
          message: "Invalid email format",
          code: 400,
          field: "email",
        },
        status: 400,
      },
    };
    
    const result = extractApiError(error);
    expect(result.message).toBe("Invalid email format");
    expect(result.field).toBe("email");
  });

  it("should fall back to error.message if no response", () => {
    const error = {
      message: "Network Error",
    };
    
    const result = extractApiError(error);
    expect(result.message).toBe("Network Error");
  });

  it("should return default message for unknown error", () => {
    const result = extractApiError({});
    expect(result.message).toBe("Đã xảy ra lỗi, vui lòng thử lại sau");
    expect(result.code).toBe(500);
  });

  it("should handle null error", () => {
    const result = extractApiError(null);
    expect(result.message).toBe("Đã xảy ra lỗi, vui lòng thử lại sau");
  });

  it("should handle undefined error", () => {
    const result = extractApiError(undefined);
    expect(result.message).toBe("Đã xảy ra lỗi, vui lòng thử lại sau");
  });
});

describe("getLocalizedError", () => {
  it("should return localized message for known error codes", () => {
    expect(getLocalizedError("PRODUCT_NOT_FOUND")).toBe("Không tìm thấy sản phẩm");
    expect(getLocalizedError("UNAUTHORIZED")).toBe("Bạn cần đăng nhập để thực hiện thao tác này");
    expect(getLocalizedError("FORBIDDEN")).toBe("Bạn không có quyền thực hiện thao tác này");
  });

  it("should return fallback for unknown error codes", () => {
    expect(getLocalizedError("UNKNOWN_CODE", "Custom fallback")).toBe("Custom fallback");
  });

  it("should return default server error for unknown codes without fallback", () => {
    expect(getLocalizedError("UNKNOWN_CODE")).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  /**
   * Property: All known error codes should have non-empty messages
   */
  it("should have non-empty messages for all known error codes", () => {
    Object.entries(ERROR_MESSAGES).forEach(([code, message]) => {
      expect(message).toBeTruthy();
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
      expect(getLocalizedError(code)).toBe(message);
    });
  });
});
