import { BaseEntity, PaginationData } from "./common";
import { User } from "./user";
import { Shop } from "./shop";
import { ShopCategory } from "./shopCategory";

// ============ Sub-Interfaces ============

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Price {
  currentPrice: number;
  discountPrice?: number | null;
  currency: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductDimensions {
  height?: number;
  width?: number;
  length?: number;
}

export interface FlashSaleInfo {
  isActive: boolean;
  salePrice?: number;
  discountPercent?: number;
  stock?: number;
  soldCount?: number;
  startTime?: string;
  endTime?: string;
}

// Variant Schema - Color differentiation only
// SKU is auto-generated, size is at product level
export interface Variant {
  _id: string;
  name: string; // Display name
  sku?: string;
  color?: string;
  price: number;
  stock: number;
  sold?: number;
  images: string[];
}

export type ProductStatus = "draft" | "published" | "suspended" | "deleted";

// ============ Main Product Interface ============

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string;

  // Core Relations
  shop: Shop | string; // Populated or ID
  category: Category | null;
  shopCategory?: ShopCategory | string; // Populated or ID

  // Metadata
  brand?: string;
  tags?: string[];

  // Sizes - Product level (applies to all variants)
  sizes: string[];

  // Media
  descriptionImages: string[];
  video?: string;

  // Pricing & Inventory (cached aggregates/product level)
  price: Price;
  stock: number;
  soldCount: number;

  // Variants (Colors)
  variants: Variant[];

  // Shipping
  shippingTemplate?: string; // ID
  weight: number;
  dimensions?: ProductDimensions;

  // Attributes/Specs
  attributes: ProductAttribute[];

  // Statistics
  ratingAverage: number;
  reviewCount: number;

  // Flash Sale
  flashSale?: FlashSaleInfo;

  // Flags
  isFeatured: boolean;
  isNewArrival: boolean;
  status: ProductStatus;

  // Virtuals
  onSale?: boolean;
  isActive?: boolean;
  effectivePrice?: number;
}

// ============ Helpers ============

export function getVariantDisplay(variant: Variant): string {
  if (variant.name) return variant.name;
  if (variant.color) return variant.color;
  return "Mặc định";
}

export function findVariantByColor(
  product: Product,
  color: string
): Variant | undefined {
  return product.variants?.find((v) => v.color === color);
}

export function getUniqueColors(variants: Variant[]): string[] {
  const colors = new Set<string>();
  variants.forEach((v) => {
    if (v.color) colors.add(v.color);
  });
  return Array.from(colors);
}

// ============ State & Filters ============

export interface ProductState {
  all: Product[];
  featured: Product[];
  newArrivals: Product[];
  onSale: Product[];
  byCategory: Product[];
  currentProduct: Product | null;
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  searchResults: Product[];
  isSearching: boolean;
  searchError: string | null;
  related: Product[];
}

export interface ProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

export interface AdminProductFilters {
  page: number;
  limit: number;
  search: string;
  category: string;
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean | null;
  [key: string]: string | number | boolean | null;
}

export interface ProductUrlFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  rating: string;
  colors: string;
  sizes: string;
  sortBy: string;
  [key: string]: string | number | boolean | null;
}

// ============ Form Types (Local File Handling) ============

export interface VariantImagesCreate {
  files: File[];
  previews: string[];
  existing: string[];
}

export interface VariantImagesUpdate {
  existing: string[];
  newFiles: File[];
  newPreviews: string[];
}

export interface VariantWithFilesCreate
  extends Omit<Variant, "_id" | "images"> {
  _id: string;
  images: VariantImagesCreate;
}

export interface VariantWithFilesUpdate {
  _id: string;
  name: string;
  color?: string;
  price: number;
  stock: number;
  sold?: number;
  images: VariantImagesUpdate;
}

export type VariantWithFiles = VariantWithFilesCreate | VariantWithFilesUpdate;

export function isVariantForCreate(
  variant: VariantWithFiles
): variant is VariantWithFilesCreate {
  return "files" in variant.images && "previews" in variant.images;
}

export function isVariantForUpdate(
  variant: VariantWithFiles
): variant is VariantWithFilesUpdate {
  return "newFiles" in variant.images && "newPreviews" in variant.images;
}

export function createEmptyVariantForCreate(
  defaultPrice: number = 0
): VariantWithFilesCreate {
  return {
    _id: `temp-${Date.now()}`,
    name: "",
    color: "",
    price: defaultPrice,
    stock: 0,
    sold: 0,
    images: { files: [], previews: [], existing: [] },
  };
}

export function createEmptyVariantForUpdate(
  defaultPrice: number = 0
): VariantWithFilesUpdate {
  return {
    _id: `temp-${Date.now()}`,
    name: "",
    color: "",
    price: defaultPrice,
    stock: 0,
    sold: 0,
    images: { existing: [], newFiles: [], newPreviews: [] },
  };
}

export function variantToEditForm(variant: Variant): VariantWithFilesUpdate {
  return {
    _id: variant._id,
    name: variant.name,
    color: variant.color || "",
    price: variant.price,
    stock: variant.stock,
    sold: variant.sold || 0,
    images: {
      existing: variant.images || [],
      newFiles: [],
      newPreviews: [],
    },
  };
}

// ============ Form Variant Types for Admin Components ============

// Simplified variant for create form (used in CreateModelProduct.tsx)
export interface CreateVariant {
  _id: string;
  name: string;
  color?: string;
  price: number;
  stock: number;
  sold?: number;
  images: {
    files: File[];
    previews: string[];
  };
}

// Simplified variant for update form (used in UpdateModelProduct.tsx)
export interface UpdateVariant {
  _id: string;
  name: string;
  color?: string;
  price: number;
  stock: number;
  sold?: number;
  images: {
    existing: string[];
    newFiles: File[];
    newPreviews: string[];
  };
}

// Helper to create empty variant for create form
export function createEmptyCreateVariant(defaultPrice: number = 0): CreateVariant {
  return {
    _id: `temp-${Date.now()}`,
    name: "",
    color: "",
    price: defaultPrice,
    stock: 0,
    sold: 0,
    images: { files: [], previews: [] },
  };
}

// Helper to create empty variant for update form
export function createEmptyUpdateVariant(defaultPrice: number = 0): UpdateVariant {
  return {
    _id: `temp-${Date.now()}`,
    name: "",
    color: "",
    price: defaultPrice,
    stock: 0,
    sold: 0,
    images: { existing: [], newFiles: [], newPreviews: [] },
  };
}

// Helper to convert API variant to update form variant
export function variantToUpdateForm(variant: Variant): UpdateVariant {
  return {
    _id: variant._id,
    name: variant.name,
    color: variant.color || "",
    price: variant.price,
    stock: variant.stock,
    sold: variant.sold || 0,
    images: {
      existing: variant.images || [],
      newFiles: [],
      newPreviews: [],
    },
  };
}

export type { PaginationData };
