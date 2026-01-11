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

// For creating new variants (with file uploads)
export interface VariantFormCreate {
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

// For updating existing variants (with file uploads)
export interface VariantFormUpdate {
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

// Union type for form handling
export type VariantForm = VariantFormCreate | VariantFormUpdate;

// Type guards
export function isVariantFormCreate(
  variant: VariantForm
): variant is VariantFormCreate {
  return "files" in variant.images && "previews" in variant.images;
}

export function isVariantFormUpdate(
  variant: VariantForm
): variant is VariantFormUpdate {
  return "newFiles" in variant.images && "newPreviews" in variant.images;
}

// Factory function for creating empty variant (create form)
export function createEmptyVariantForm(
  defaultPrice: number = 0
): VariantFormCreate {
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

// Factory function for creating empty variant (update form)
export function createEmptyVariantFormUpdate(
  defaultPrice: number = 0
): VariantFormUpdate {
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

// Convert API variant to update form variant
export function variantToForm(variant: Variant): VariantFormUpdate {
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

// ============ Backward Compatibility Aliases (Deprecated) ============
// These aliases are kept for backward compatibility during migration
// TODO: Remove after all usages are updated

/** @deprecated Use VariantFormCreate instead */
export type VariantWithFilesCreate = VariantFormCreate;
/** @deprecated Use VariantFormUpdate instead */
export type VariantWithFilesUpdate = VariantFormUpdate;
/** @deprecated Use VariantForm instead */
export type VariantWithFiles = VariantForm;
/** @deprecated Use VariantFormCreate instead */
export type CreateVariant = VariantFormCreate;
/** @deprecated Use VariantFormUpdate instead */
export type UpdateVariant = VariantFormUpdate;

/** @deprecated Use isVariantFormCreate instead */
export const isVariantForCreate = isVariantFormCreate;
/** @deprecated Use isVariantFormUpdate instead */
export const isVariantForUpdate = isVariantFormUpdate;
/** @deprecated Use createEmptyVariantForm instead */
export const createEmptyVariantForCreate = createEmptyVariantForm;
/** @deprecated Use createEmptyVariantFormUpdate instead */
export const createEmptyVariantForUpdate = createEmptyVariantFormUpdate;
/** @deprecated Use createEmptyVariantForm instead */
export const createEmptyCreateVariant = createEmptyVariantForm;
/** @deprecated Use createEmptyVariantFormUpdate instead */
export const createEmptyUpdateVariant = createEmptyVariantFormUpdate;
/** @deprecated Use variantToForm instead */
export const variantToEditForm = variantToForm;
/** @deprecated Use variantToForm instead */
export const variantToUpdateForm = variantToForm;
