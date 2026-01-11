/**
 * Property Test: API Data Extraction Consistency
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 * 
 * Tests that extractApiData utility correctly handles both nested and flat API responses
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { extractApiData, ApiResponse } from "@/utils/api";

describe("Property: API Data Extraction Consistency", () => {
  // Arbitrary for generating random data payloads
  const dataArbitrary = fc.oneof(
    fc.array(fc.record({ id: fc.string(), name: fc.string() })),
    fc.record({ id: fc.string(), value: fc.integer() }),
    fc.string(),
    fc.integer(),
    fc.constant(null)
  );

  it("should extract data from nested response structure", () => {
    fc.assert(
      fc.property(dataArbitrary, (payload) => {
        // Nested structure: { data: { status: "success", data: payload } }
        const nestedResponse = {
          data: {
            status: "success" as const,
            message: "OK",
            code: 200,
            data: payload,
          } satisfies ApiResponse<typeof payload>,
        };

        const result = extractApiData(nestedResponse);
        expect(result).toEqual(payload);
      }),
      { numRuns: 50 }
    );
  });

  it("should extract data from flat response structure", () => {
    fc.assert(
      fc.property(dataArbitrary, (payload) => {
        // Flat structure: { data: payload }
        const flatResponse = { data: payload };

        const result = extractApiData(flatResponse);
        expect(result).toEqual(payload);
      }),
      { numRuns: 50 }
    );
  });

  it("should handle array data consistently", () => {
    const arrayArbitrary = fc.array(
      fc.record({
        _id: fc.string(),
        name: fc.string(),
        price: fc.integer({ min: 0 }),
      }),
      { minLength: 0, maxLength: 20 }
    );

    fc.assert(
      fc.property(arrayArbitrary, (items) => {
        // Test nested
        const nestedResponse = {
          data: {
            status: "success" as const,
            message: "OK",
            code: 200,
            data: items,
          },
        };
        expect(extractApiData(nestedResponse)).toEqual(items);

        // Test flat
        const flatResponse = { data: items };
        expect(extractApiData(flatResponse)).toEqual(items);
      }),
      { numRuns: 30 }
    );
  });

  it("should preserve data types through extraction", () => {
    fc.assert(
      fc.property(
        fc.record({
          string: fc.string(),
          number: fc.integer(),
          boolean: fc.boolean(),
          array: fc.array(fc.integer()),
          nested: fc.record({ key: fc.string() }),
        }),
        (payload) => {
          const response = {
            data: {
              status: "success" as const,
              message: "OK",
              code: 200,
              data: payload,
            },
          };

          const result = extractApiData(response);

          expect(typeof result.string).toBe("string");
          expect(typeof result.number).toBe("number");
          expect(typeof result.boolean).toBe("boolean");
          expect(Array.isArray(result.array)).toBe(true);
          expect(typeof result.nested).toBe("object");
        }
      ),
      { numRuns: 30 }
    );
  });
});
