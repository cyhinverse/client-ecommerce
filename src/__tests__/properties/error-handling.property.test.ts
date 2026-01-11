/**
 * Property-Based Tests for Error Handling Consistency
 * 
 * Feature: code-cleanup-audit
 * Property 2: Error Handling Pattern Consistency
 * 
 * For any failed API call in Redux async thunks, the error SHALL be handled
 * using rejectWithValue with a structured ApiError object containing at
 * minimum a message field.
 * 
 * **Validates: Requirements 2.2, 7.2, 14.1, 14.2**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { extractApiError, ApiError } from "@/api";

describe("Feature: code-cleanup-audit, Property 2: Error Handling Pattern Consistency", () => {
  describe("extractApiError utility", () => {
    /**
     * Property: For any error input, extractApiError SHALL return an ApiError
     * object with at minimum a message field
     */
    it("should always return an object with a message field", () => {
      fc.assert(
        fc.property(
          fc.anything(),
          (errorInput) => {
            const result = extractApiError(errorInput);
            
            // Must have message field
            expect(result).toHaveProperty("message");
            expect(typeof result.message).toBe("string");
            expect(result.message.length).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any axios-like error with response.data.message,
     * extractApiError SHALL extract that message
     */
    it("should extract message from axios error response", () => {
      fc.assert(
        fc.property(
          fc.record({
            message: fc.string({ minLength: 1 }),
            code: fc.option(fc.integer({ min: 100, max: 599 })),
            field: fc.option(fc.string()),
          }),
          (errorData) => {
            const axiosError = {
              response: {
                data: errorData,
                status: errorData.code || 500,
              },
            };
            
            const result = extractApiError(axiosError);
            
            expect(result.message).toBe(errorData.message);
            if (errorData.code) {
              expect(result.code).toBe(errorData.code);
            }
            if (errorData.field) {
              expect(result.field).toBe(errorData.field);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any error with only a message property (no response),
     * extractApiError SHALL use that message
     */
    it("should fallback to error.message when no response data", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (errorMessage) => {
            const error = { message: errorMessage };
            const result = extractApiError(error);
            
            expect(result.message).toBe(errorMessage);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For null or undefined errors, extractApiError SHALL return
     * a default error message
     */
    it("should handle null and undefined errors gracefully", () => {
      const nullResult = extractApiError(null);
      const undefinedResult = extractApiError(undefined);
      
      expect(nullResult).toHaveProperty("message");
      expect(nullResult.message.length).toBeGreaterThan(0);
      expect(nullResult.code).toBe(500);
      
      expect(undefinedResult).toHaveProperty("message");
      expect(undefinedResult.message.length).toBeGreaterThan(0);
      expect(undefinedResult.code).toBe(500);
    });

    /**
     * Property: The returned ApiError SHALL always be a valid ApiError structure
     */
    it("should always return a valid ApiError structure", () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Axios-like error with response
            fc.record({
              response: fc.record({
                data: fc.record({
                  message: fc.option(fc.string({ minLength: 1 })),
                  code: fc.option(fc.integer({ min: 100, max: 599 })),
                  field: fc.option(fc.string()),
                }),
                status: fc.option(fc.integer({ min: 100, max: 599 })),
              }),
              message: fc.option(fc.string()),
            }),
            // Simple error with message
            fc.record({
              message: fc.option(fc.string()),
            }),
            // Primitive values
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
            fc.constant(undefined),
          ),
          (errorInput) => {
            const result = extractApiError(errorInput);
            
            // Validate ApiError structure
            expect(typeof result).toBe("object");
            expect(result).not.toBeNull();
            expect(typeof result.message).toBe("string");
            
            // code should be number, undefined, or null (from API)
            if (result.code !== undefined && result.code !== null) {
              expect(typeof result.code).toBe("number");
            }
            
            // field should be string, undefined, or null (from API)
            if (result.field !== undefined && result.field !== null) {
              expect(typeof result.field).toBe("string");
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("ApiError type conformance", () => {
    /**
     * Property: Any object returned by extractApiError SHALL conform to ApiError interface
     */
    it("should return objects conforming to ApiError interface", () => {
      const testCases = [
        { response: { data: { message: "Test error" } } },
        { response: { data: { message: "Error", code: 400 } } },
        { response: { data: { message: "Error", code: 422, field: "email" } } },
        { message: "Network error" },
        null,
        undefined,
        "string error",
        123,
        {},
      ];

      testCases.forEach((testCase) => {
        const result: ApiError = extractApiError(testCase);
        
        // Type check - these should compile without errors
        const message: string = result.message;
        const code: number | undefined = result.code;
        const field: string | undefined = result.field;
        
        expect(message).toBeDefined();
        expect(typeof message).toBe("string");
        
        // Ensure no extra properties that violate the interface
        const allowedKeys = ["message", "code", "field"];
        Object.keys(result).forEach((key) => {
          expect(allowedKeys).toContain(key);
        });
      });
    });
  });

  describe("Error message preservation", () => {
    /**
     * Property: For any non-empty error message in the response,
     * that exact message SHALL be preserved in the output
     */
    it("should preserve exact error messages from server", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }),
          (originalMessage) => {
            const error = {
              response: {
                data: { message: originalMessage },
              },
            };
            
            const result = extractApiError(error);
            expect(result.message).toBe(originalMessage);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Vietnamese error messages SHALL be preserved correctly
     */
    it("should preserve Vietnamese error messages", () => {
      const vietnameseMessages = [
        "Đăng nhập thất bại",
        "Không tìm thấy sản phẩm",
        "Bạn cần đăng nhập để thực hiện thao tác này",
        "Dữ liệu không hợp lệ",
        "Đã xảy ra lỗi, vui lòng thử lại sau",
      ];

      vietnameseMessages.forEach((message) => {
        const error = {
          response: {
            data: { message },
          },
        };
        
        const result = extractApiError(error);
        expect(result.message).toBe(message);
      });
    });
  });

  describe("HTTP status code handling", () => {
    /**
     * Property: For any valid HTTP status code in the error response,
     * that code SHALL be included in the ApiError
     */
    it("should include HTTP status codes from response", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 599 }),
          (statusCode) => {
            const error = {
              response: {
                data: { message: "Error", code: statusCode },
                status: statusCode,
              },
            };
            
            const result = extractApiError(error);
            expect(result.code).toBe(statusCode);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Common HTTP error codes SHALL be handled correctly
     */
    it("should handle common HTTP error codes", () => {
      const commonCodes = [400, 401, 403, 404, 422, 500, 502, 503];
      
      commonCodes.forEach((code) => {
        const error = {
          response: {
            data: { message: `Error ${code}`, code },
            status: code,
          },
        };
        
        const result = extractApiError(error);
        expect(result.code).toBe(code);
      });
    });
  });
});
