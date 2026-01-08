/**
 * Unit tests for category utilities
 * Feature: code-cleanup-audit
 * Validates: Requirements 6.1, 9.1
 */

import { describe, it, expect } from "vitest";
import {
  flattenCategories,
  findCategoryById,
  getCategoryPath,
  getLeafCategories,
  type FlatCategory,
} from "@/utils/category";
import { Category } from "@/types/category";

describe("flattenCategories", () => {
  it("should return empty array for empty input", () => {
    expect(flattenCategories([])).toEqual([]);
  });

  it("should flatten single category without subcategories", () => {
    const categories: Category[] = [
      { _id: "1", name: "Electronics", slug: "electronics" },
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      _id: "1",
      name: "Electronics",
      displayName: "Electronics",
    });
  });

  it("should flatten categories with one level of subcategories", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "Electronics",
        slug: "electronics",
        subcategories: [
          { _id: "2", name: "Phones", slug: "phones" },
          { _id: "3", name: "Laptops", slug: "laptops" },
        ],
      },
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(3);
    expect(result[0].displayName).toBe("Electronics");
    expect(result[1].displayName).toBe("Electronics > Phones");
    expect(result[2].displayName).toBe("Electronics > Laptops");
  });

  it("should flatten deeply nested categories", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "Electronics",
        slug: "electronics",
        subcategories: [
          {
            _id: "2",
            name: "Phones",
            slug: "phones",
            subcategories: [
              { _id: "3", name: "Smartphones", slug: "smartphones" },
            ],
          },
        ],
      },
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(3);
    expect(result[2].displayName).toBe("Electronics > Phones > Smartphones");
  });

  it("should handle multiple root categories", () => {
    const categories: Category[] = [
      { _id: "1", name: "Electronics", slug: "electronics" },
      { _id: "2", name: "Clothing", slug: "clothing" },
      { _id: "3", name: "Books", slug: "books" },
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(3);
    expect(result.map(c => c.name)).toEqual(["Electronics", "Clothing", "Books"]);
  });

  it("should skip categories without _id", () => {
    const categories = [
      { _id: "1", name: "Valid", slug: "valid" },
      { name: "Invalid", slug: "invalid" } as Category,
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  it("should skip categories without name", () => {
    const categories = [
      { _id: "1", name: "Valid", slug: "valid" },
      { _id: "2", slug: "invalid" } as Category,
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  it("should handle empty subcategories array", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "Electronics",
        slug: "electronics",
        subcategories: [],
      },
    ];
    
    const result = flattenCategories(categories);
    
    expect(result).toHaveLength(1);
  });

  it("should preserve order of categories", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "A",
        slug: "a",
        subcategories: [
          { _id: "2", name: "A1", slug: "a1" },
          { _id: "3", name: "A2", slug: "a2" },
        ],
      },
      {
        _id: "4",
        name: "B",
        slug: "b",
        subcategories: [
          { _id: "5", name: "B1", slug: "b1" },
        ],
      },
    ];
    
    const result = flattenCategories(categories);
    const names = result.map(c => c.name);
    
    expect(names).toEqual(["A", "A1", "A2", "B", "B1"]);
  });
});

describe("findCategoryById", () => {
  const categories: Category[] = [
    {
      _id: "1",
      name: "Electronics",
      slug: "electronics",
      subcategories: [
        {
          _id: "2",
          name: "Phones",
          slug: "phones",
          subcategories: [
            { _id: "3", name: "Smartphones", slug: "smartphones" },
          ],
        },
      ],
    },
    { _id: "4", name: "Clothing", slug: "clothing" },
  ];

  it("should find root category", () => {
    const result = findCategoryById(categories, "1");
    expect(result?.name).toBe("Electronics");
  });

  it("should find nested category", () => {
    const result = findCategoryById(categories, "2");
    expect(result?.name).toBe("Phones");
  });

  it("should find deeply nested category", () => {
    const result = findCategoryById(categories, "3");
    expect(result?.name).toBe("Smartphones");
  });

  it("should return undefined for non-existent id", () => {
    const result = findCategoryById(categories, "999");
    expect(result).toBeUndefined();
  });

  it("should return undefined for empty categories", () => {
    const result = findCategoryById([], "1");
    expect(result).toBeUndefined();
  });
});

describe("getCategoryPath", () => {
  const categories: Category[] = [
    {
      _id: "1",
      name: "Electronics",
      slug: "electronics",
      subcategories: [
        {
          _id: "2",
          name: "Phones",
          slug: "phones",
          subcategories: [
            { _id: "3", name: "Smartphones", slug: "smartphones" },
          ],
        },
      ],
    },
  ];

  it("should return path for root category", () => {
    const result = getCategoryPath(categories, "1");
    expect(result).toEqual(["Electronics"]);
  });

  it("should return full path for nested category", () => {
    const result = getCategoryPath(categories, "3");
    expect(result).toEqual(["Electronics", "Phones", "Smartphones"]);
  });

  it("should return empty array for non-existent id", () => {
    const result = getCategoryPath(categories, "999");
    expect(result).toEqual([]);
  });
});

describe("getLeafCategories", () => {
  it("should return all categories when none have subcategories", () => {
    const categories: Category[] = [
      { _id: "1", name: "A", slug: "a" },
      { _id: "2", name: "B", slug: "b" },
    ];
    
    const result = getLeafCategories(categories);
    
    expect(result).toHaveLength(2);
  });

  it("should return only leaf categories", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "Parent",
        slug: "parent",
        subcategories: [
          { _id: "2", name: "Child", slug: "child" },
        ],
      },
    ];
    
    const result = getLeafCategories(categories);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Child");
  });

  it("should handle deeply nested structure", () => {
    const categories: Category[] = [
      {
        _id: "1",
        name: "L1",
        slug: "l1",
        subcategories: [
          {
            _id: "2",
            name: "L2",
            slug: "l2",
            subcategories: [
              { _id: "3", name: "L3", slug: "l3" },
            ],
          },
        ],
      },
    ];
    
    const result = getLeafCategories(categories);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("L3");
  });

  it("should return empty array for empty input", () => {
    const result = getLeafCategories([]);
    expect(result).toEqual([]);
  });
});
