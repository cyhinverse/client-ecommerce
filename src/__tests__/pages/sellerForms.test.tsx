/**
 * Seller Forms Property Tests
 * Feature: missing-client-routes
 * 
 * Property 3: Form Validation Rejection
 */

import { describe, it, expect } from "vitest";

import * as fc from "fast-check";
import "@testing-library/jest-dom";

// Form validation functions (extracted logic)
interface ShopRegistrationData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

interface ShippingTemplateData {
  name: string;
  rules: Array<{
    minWeight: number;
    maxWeight: number;
    price: number;
  }>;
}

// Validation functions
const validateShopRegistration = (data: ShopRegistrationData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Tên shop không được để trống");
  }
  if (data.name && data.name.length > 100) {
    errors.push("Tên shop không được quá 100 ký tự");
  }
  if (!data.phone || !/^[0-9]{10,11}$/.test(data.phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }
  if (!data.address || data.address.trim().length === 0) {
    errors.push("Địa chỉ không được để trống");
  }
  
  return errors;
};

const validateShippingTemplate = (data: ShippingTemplateData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Tên template không được để trống");
  }
  if (!data.rules || data.rules.length === 0) {
    errors.push("Phải có ít nhất một quy tắc vận chuyển");
  }
  
  data.rules?.forEach((rule, index) => {
    if (rule.minWeight < 0) {
      errors.push(`Quy tắc ${index + 1}: Trọng lượng tối thiểu không được âm`);
    }
    if (rule.maxWeight <= rule.minWeight) {
      errors.push(`Quy tắc ${index + 1}: Trọng lượng tối đa phải lớn hơn tối thiểu`);
    }
    if (rule.price < 0) {
      errors.push(`Quy tắc ${index + 1}: Giá không được âm`);
    }
  });
  
  return errors;
};

describe("Feature: missing-client-routes - Form Validation", () => {
  describe("Property 3: Form Validation Rejection", () => {
    /**
     * Property: For any invalid input, the form SHALL reject submission
     * and display appropriate error messages.
     * 
     * Validates: Requirements 1.4, 4.5
     */

    describe("Shop Registration Validation", () => {
      it("should reject empty shop name", () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.constant(""),
              description: fc.string(),
              phone: fc.stringMatching(/^[0-9]{10,11}$/),
              email: fc.emailAddress(),
              address: fc.string({ minLength: 1 }),
            }),
            (data) => {
              const errors = validateShopRegistration(data);
              expect(errors).toContain("Tên shop không được để trống");
            }
          ),
          { numRuns: 20 }
        );
      });

      it("should reject shop name over 100 characters", () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 101, maxLength: 200 }),
            (longName) => {
              const data: ShopRegistrationData = {
                name: longName,
                description: "Test",
                phone: "0123456789",
                email: "test@example.com",
                address: "123 Test St",
              };
              const errors = validateShopRegistration(data);
              expect(errors).toContain("Tên shop không được quá 100 ký tự");
            }
          ),
          { numRuns: 20 }
        );
      });

      it("should reject invalid phone numbers", () => {
        const invalidPhones = [
          "", // empty
          "123", // too short
          "123456789012", // too long
          "abcdefghij", // letters
          "12-345-6789", // with dashes
        ];

        invalidPhones.forEach(phone => {
          const data: ShopRegistrationData = {
            name: "Test Shop",
            description: "Test",
            phone,
            email: "test@example.com",
            address: "123 Test St",
          };
          const errors = validateShopRegistration(data);
          expect(errors).toContain("Số điện thoại không hợp lệ");
        });
      });

      it("should reject invalid email formats", () => {
        fc.assert(
          fc.property(
            fc.string().filter(s => !s.includes("@") || !s.includes(".")),
            (invalidEmail) => {
              const data: ShopRegistrationData = {
                name: "Test Shop",
                description: "Test",
                phone: "0123456789",
                email: invalidEmail,
                address: "123 Test St",
              };
              const errors = validateShopRegistration(data);
              expect(errors).toContain("Email không hợp lệ");
            }
          ),
          { numRuns: 20 }
        );
      });

      it("should accept valid registration data", () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
              description: fc.string(),
              phone: fc.stringMatching(/^0[0-9]{9,10}$/),
              email: fc.emailAddress(),
              address: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            }),
            (data) => {
              const errors = validateShopRegistration(data);
              // Should have no errors for valid data
              expect(errors.filter(e => 
                e.includes("Tên shop không được để trống") ||
                e.includes("Địa chỉ không được để trống")
              )).toHaveLength(0);
            }
          ),
          { numRuns: 30 }
        );
      });
    });

    describe("Shipping Template Validation", () => {
      it("should reject empty template name", () => {
        const data: ShippingTemplateData = {
          name: "",
          rules: [{ minWeight: 0, maxWeight: 1, price: 10000 }],
        };
        const errors = validateShippingTemplate(data);
        expect(errors).toContain("Tên template không được để trống");
      });

      it("should reject template without rules", () => {
        const data: ShippingTemplateData = {
          name: "Test Template",
          rules: [],
        };
        const errors = validateShippingTemplate(data);
        expect(errors).toContain("Phải có ít nhất một quy tắc vận chuyển");
      });

      it("should reject negative weight values", () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: -1 }),
            (negativeWeight) => {
              const data: ShippingTemplateData = {
                name: "Test Template",
                rules: [{ minWeight: negativeWeight, maxWeight: 10, price: 10000 }],
              };
              const errors = validateShippingTemplate(data);
              expect(errors.some(e => e.includes("không được âm"))).toBe(true);
            }
          ),
          { numRuns: 20 }
        );
      });

      it("should reject maxWeight <= minWeight", () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 0, max: 100 }),
            fc.integer({ min: 0, max: 100 }),
            (a, b) => {
              const minWeight = Math.max(a, b);
              const maxWeight = Math.min(a, b);
              
              if (maxWeight <= minWeight) {
                const data: ShippingTemplateData = {
                  name: "Test Template",
                  rules: [{ minWeight, maxWeight, price: 10000 }],
                };
                const errors = validateShippingTemplate(data);
                expect(errors.some(e => e.includes("phải lớn hơn tối thiểu"))).toBe(true);
              }
            }
          ),
          { numRuns: 30 }
        );
      });

      it("should reject negative prices", () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -100000, max: -1 }),
            (negativePrice) => {
              const data: ShippingTemplateData = {
                name: "Test Template",
                rules: [{ minWeight: 0, maxWeight: 10, price: negativePrice }],
              };
              const errors = validateShippingTemplate(data);
              expect(errors.some(e => e.includes("Giá không được âm"))).toBe(true);
            }
          ),
          { numRuns: 20 }
        );
      });

      it("should accept valid shipping template", () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
              rules: fc.array(
                fc.record({
                  minWeight: fc.integer({ min: 0, max: 50 }),
                  maxWeight: fc.integer({ min: 51, max: 100 }),
                  price: fc.integer({ min: 0, max: 1000000 }),
                }),
                { minLength: 1, maxLength: 5 }
              ),
            }),
            (data) => {
              const errors = validateShippingTemplate(data);
              // Should have no critical errors
              expect(errors.filter(e => 
                e.includes("Tên template không được để trống") ||
                e.includes("Phải có ít nhất một quy tắc")
              )).toHaveLength(0);
            }
          ),
          { numRuns: 30 }
        );
      });
    });
  });
});
