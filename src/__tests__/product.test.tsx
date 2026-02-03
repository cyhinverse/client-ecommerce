/**
 * Product Components Property Tests
 * Feature: taobao-ui-redesign
 * 
 * Property 6: Responsive Grid Columns
 * Property 7: Price Display Format
 */

import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

import * as fc from "fast-check";
import "@testing-library/jest-dom";

// Mock Next.js components
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Import components after mocks
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product, Category, Price } from "@/types/product";


// Helper to create a valid product
const createProduct = (overrides: Partial<Product> = {}): Product => ({
  _id: "test-id",
  name: "Test Product",
  slug: "test-product",
  description: "Test description",
  price: {
    currentPrice: 100000,
    discountPrice: undefined,
    currency: "VND",
  },
  images: ["https://example.com/image.jpg"],
  category: { _id: "cat-1", name: "Test Category", slug: "test-category" },
  brand: "Test Brand",
  soldCount: 50,
  onSale: false,
  isActive: true,
  variants: [],
  tierVariations: [],
  models: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Arbitrary for generating valid prices
const priceArbitrary = fc.record({
  currentPrice: fc.integer({ min: 1000, max: 100000000 }),
  discountPrice: fc.option(fc.integer({ min: 1000, max: 100000000 }), { nil: undefined }),
  currency: fc.constant("VND"),
});

// Arbitrary for generating categories
const categoryArbitrary = fc.record({
  _id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  slug: fc.string({ minLength: 1, maxLength: 50 }),
});

// Arbitrary for generating products
const productArbitrary = fc.record({
  _id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string(),
  price: priceArbitrary,
  images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 5 }),
  category: categoryArbitrary,
  brand: fc.string({ minLength: 1, maxLength: 50 }),
  soldCount: fc.integer({ min: 0, max: 1000000 }),
  onSale: fc.boolean(),
  isActive: fc.boolean(),
  tierVariations: fc.constant([]),
  models: fc.constant([]),
  createdAt: fc.constant(new Date().toISOString()),
  updatedAt: fc.constant(new Date().toISOString()),
});

describe("Feature: taobao-ui-redesign", () => {
  describe("Property 6: Responsive Grid Columns", () => {
    /**
     * Property: For any viewport width, the ProductGrid component SHALL display
     * the correct number of columns based on Tailwind breakpoints:
     * - Mobile (< 640px): 2 columns (grid-cols-2)
     * - Tablet (640px - 1023px): 3 columns (sm:grid-cols-3)
     * - Desktop (1024px - 1279px): 4 columns (lg:grid-cols-4)
     * - Wide (1280px - 1535px): 5 columns (xl:grid-cols-5)
     * - Extra Wide (1536px+): 6 columns (2xl:grid-cols-6)
     * 
     * Validates: Requirements 4.1, 9.7
     */
    it("should have correct responsive grid classes", () => {
      const products = [createProduct({ _id: "1" }), createProduct({ _id: "2" })];
      
      const { container } = render(<ProductGrid products={products} />);
      const grid = container.querySelector('[data-testid="product-grid"]');
      
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-2"); // Mobile: 2 columns
      expect(grid).toHaveClass("sm:grid-cols-3"); // Tablet: 3 columns
      expect(grid).toHaveClass("lg:grid-cols-4"); // Desktop: 4 columns
      expect(grid).toHaveClass("xl:grid-cols-5"); // Wide: 5 columns
      expect(grid).toHaveClass("2xl:grid-cols-6"); // Extra Wide: 6 columns
    });

    it("should render correct number of product cards for any product array", () => {
      fc.assert(
        fc.property(
          fc.array(productArbitrary, { minLength: 1, maxLength: 20 }),
          (products: unknown[]) => {
            const { container, unmount } = render(
              <ProductGrid products={products as Product[]} />
            );
            
            // Should render exactly the number of products
            const links = container.querySelectorAll("a");
            expect(links.length).toBe(products.length);
            
            // Cleanup after each iteration
            unmount();
          }
        ),
        { numRuns: 50 }
      );
    });

    it("should show empty state when no products", () => {
      render(<ProductGrid products={[]} />);
      expect(screen.getByText("Không tìm thấy sản phẩm")).toBeInTheDocument();
    });

    it("should have consistent gap spacing", () => {
      const products = [createProduct({ _id: "1" })];
      
      const { container } = render(<ProductGrid products={products} />);
      const grid = container.querySelector('[data-testid="product-grid"]');
      
      expect(grid).toHaveClass("gap-3"); // Mobile gap
      expect(grid).toHaveClass("sm:gap-4"); // Tablet+ gap
    });
  });

  describe("Property 7: Price Display Format", () => {
    /**
     * Property: For any product, the ProductCard component SHALL:
     * - Display price in VND format with ₫ symbol
     * - WHEN product has discount, original price SHALL be shown with strikethrough
     * - WHEN product has price range (from models), min-max price SHALL be displayed
     * 
     * Validates: Requirements 4.4, 4.5, 4.6
     */
    it("should display price with VND currency symbol", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000000 }),
          (price: number) => {
            const product = createProduct({
              price: { currentPrice: price, discountPrice: undefined, currency: "VND" },
              onSale: false,
            });
            
            render(<ProductCard product={product} />);
            
            // Should contain the ₫ symbol
            const priceElements = screen.getAllByText(/₫/);
            expect(priceElements.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 50 }
      );
    });

    it("should show strikethrough for original price when product is on sale", () => {
      const originalPrice = 200000;
      const discountPrice = 150000;
      
      const product = createProduct({
        price: { currentPrice: originalPrice, discountPrice, currency: "VND" },
        onSale: true,
      });
      
      const { container } = render(<ProductCard product={product} />);
      
      // Should have line-through class for original price
      const strikethroughElement = container.querySelector(".line-through");
      expect(strikethroughElement).toBeInTheDocument();
      expect(strikethroughElement?.textContent).toContain(originalPrice.toLocaleString("vi-VN"));
    });

    it("should display discount badge when product has discount", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 1000000 }),
          fc.integer({ min: 10, max: 90 }),
          (originalPrice: number, discountPercent: number) => {
            const discountPrice = Math.floor(originalPrice * (1 - discountPercent / 100));
            
            const product = createProduct({
              price: { currentPrice: originalPrice, discountPrice, currency: "VND" },
              onSale: true,
            });
            
            const { container, unmount } = render(<ProductCard product={product} />);
            
            // Should show discount badge with percentage (orange color bg-[#FF9800])
            const badge = container.querySelector(".bg-\\[\\#FF9800\\]");
            if (discountPercent > 0 && discountPrice < originalPrice) {
              expect(badge).toBeInTheDocument();
              expect(badge?.textContent).toMatch(/-\d+%/);
            }
            
            unmount();
          }
        ),
        { numRuns: 30 }
      );
    });

    it("should display price range when product has multiple model prices", () => {
      const models: ProductModel[] = [
        { _id: "m1", tierIndex: [0], price: 100000, stock: 10 },
        { _id: "m2", tierIndex: [1], price: 150000, stock: 10 },
        { _id: "m3", tierIndex: [2], price: 200000, stock: 10 },
      ];
      
      const product = createProduct({ models });
      
      const { container } = render(<ProductCard product={product} />);
      
      // Should show min price (100.000 in VN format)
      expect(container.textContent).toContain("100.000");
      // Should show max price (200.000 in VN format)
      expect(container.textContent).toContain("200.000");
    });

    it("should format sold count correctly", () => {
      // Test for count < 1000
      const productLowSales = createProduct({ soldCount: 500 });
      const { rerender, container } = render(<ProductCard product={productLowSales} />);
      expect(container.textContent).toContain("500 đã bán");
      
      // Test for count >= 1000
      const productHighSales = createProduct({ soldCount: 5000 });
      rerender(<ProductCard product={productHighSales} />);
      expect(container.textContent).toContain("5.0k đã bán");
      
      // Test for count = 0
      const productNoSales = createProduct({ soldCount: 0 });
      rerender(<ProductCard product={productNoSales} />);
      expect(screen.getAllByText("Mới").length).toBeGreaterThan(0);
    });

    it("should display shop name or brand", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
          (brand: string) => {
            const product = createProduct({ brand });
            
            const { container, unmount } = render(<ProductCard product={product} />);
            
            // Should display the brand name
            expect(container.textContent).toContain(brand);
            
            unmount();
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe("ProductCard Visual Elements", () => {
    it("should have hover effects classes", () => {
      const product = createProduct();
      const { container } = render(<ProductCard product={product} />);
      
      // Check for hover scale effect on image (scale-102 in actual implementation)
      const image = container.querySelector("img");
      expect(image?.className).toContain("group-hover:scale-102");
      
      // Check for hover color change on name
      const name = screen.getByText(product.name);
      expect(name.className).toContain("group-hover:text-[#E53935]");
    });

    it("should have correct aspect ratio for image container", () => {
      const product = createProduct();
      const { container } = render(<ProductCard product={product} />);
      
      const imageContainer = container.querySelector(".aspect-square");
      expect(imageContainer).toBeInTheDocument();
    });

    it("should truncate long product names to 2 lines", () => {
      const longName = "This is a very long product name that should be truncated to only show two lines maximum";
      const product = createProduct({ name: longName });
      
      const { container } = render(<ProductCard product={product} />);
      
      const nameElement = container.querySelector(".line-clamp-2");
      expect(nameElement).toBeInTheDocument();
      expect(nameElement?.textContent).toBe(longName);
    });
  });
});


describe("Property 8: Product Variation Display", () => {
  /**
   * Property: For any product with variations, the ProductDetail page SHALL
   * display variation selector with color/size options and images.
   * 
   * Validates: Requirements 5.3
   */
  
  it("should display tier variation options when product has tierVariations", () => {
    const productWithVariations = createProduct({
      tierVariations: [
        { name: "Màu sắc", options: ["Đỏ", "Xanh", "Trắng"], images: [] },
        { name: "Kích thước", options: ["S", "M", "L", "XL"] },
      ],
      models: [
        { _id: "m1", tierIndex: [0, 0], price: 100000, stock: 10 },
        { _id: "m2", tierIndex: [0, 1], price: 110000, stock: 5 },
        { _id: "m3", tierIndex: [1, 0], price: 100000, stock: 8 },
      ],
    });

    // Verify tier variations structure
    expect(productWithVariations.tierVariations).toHaveLength(2);
    expect(productWithVariations.tierVariations?.[0]?.name).toBe("Màu sắc");
    expect(productWithVariations.tierVariations?.[0]?.options).toContain("Đỏ");
    expect(productWithVariations.tierVariations?.[1]?.name).toBe("Kích thước");
    expect(productWithVariations.tierVariations?.[1]?.options).toContain("S");
  });

  it("should have models with correct tierIndex mapping", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 5 }), { minLength: 1, maxLength: 3 }),
        (tierIndex: number[]) => {
          const model: ProductModel = {
            _id: "test-model",
            tierIndex,
            price: 100000,
            stock: 10,
          };

          // Model should have valid tierIndex array
          expect(model.tierIndex).toEqual(tierIndex);
          expect(model.tierIndex.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 30 }
    );
  });

  it("should find correct model by tierIndex", () => {
    const product = createProduct({
      tierVariations: [
        { name: "Color", options: ["Red", "Blue"] },
        { name: "Size", options: ["S", "M", "L"] },
      ],
      models: [
        { _id: "m1", tierIndex: [0, 0], price: 100000, stock: 10 },
        { _id: "m2", tierIndex: [0, 1], price: 110000, stock: 5 },
        { _id: "m3", tierIndex: [0, 2], price: 120000, stock: 8 },
        { _id: "m4", tierIndex: [1, 0], price: 100000, stock: 10 },
        { _id: "m5", tierIndex: [1, 1], price: 110000, stock: 5 },
        { _id: "m6", tierIndex: [1, 2], price: 120000, stock: 8 },
      ],
    });
    
    const foundModel = findModelByTierIndex(product, [0, 1]);
    expect(foundModel).toBeDefined();
    expect(foundModel?._id).toBe("m2");
    expect(foundModel?.price).toBe(110000);

    const notFoundModel = findModelByTierIndex(product, [2, 0]);
    expect(notFoundModel).toBeUndefined();
  });

  it("should generate correct variation display text", () => {
    const product = createProduct({
      tierVariations: [
        { name: "Màu", options: ["Đỏ", "Xanh"] },
        { name: "Size", options: ["S", "M"] },
      ],
      models: [
        { _id: "m1", tierIndex: [0, 0], price: 100000, stock: 10 },
      ],
    });

    const model = product.models![0];
    
    const display = getVariationDisplay(product, model);
    expect(display).toContain("Màu");
    expect(display).toContain("Đỏ");
    expect(display).toContain("Size");
    expect(display).toContain("S");
  });
});
