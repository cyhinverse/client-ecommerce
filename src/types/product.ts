import { BaseEntity, PaginationData } from "./common";
import { User } from "./user";
import { Shop } from "./shop";
import { ShopCategory } from "./shopCategory";

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

export interface Variant {
  _id: string;
  name: string;
  sku?: string;
  color?: string;
  price: number;
  stock: number;
  sold?: number;
  images: string[];
}


export type ProductStatus = "draft" | "published" | "suspended" | "deleted";

export interface Product extends BaseEntity {

  name: string;
  slug: string;
  description: string;

  shop: Shop | string;
  category: Category | null;
  shopCategory?: ShopCategory | string;

  brand?: string;
  tags?: string[];

  sizes: string[];

  descriptionImages: string[];
  video?: string;

  price: Price;
  stock: number;
  soldCount: number;

  variants: Variant[];

  shippingTemplate?: string;
  weight: number;
  dimensions?: ProductDimensions;

  attributes: ProductAttribute[];

  ratingAverage: number;
  reviewCount: number;

  flashSale?: FlashSaleInfo;

  isFeatured: boolean;
  isNewArrival: boolean;
  status: ProductStatus;

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
  color: string,
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

export type VariantForm = VariantFormCreate | VariantFormUpdate;

export function isVariantFormCreate(
  variant: VariantForm,
): variant is VariantFormCreate {
  return "files" in variant.images && "previews" in variant.images;
}

export function isVariantFormUpdate(
  variant: VariantForm,
): variant is VariantFormUpdate {
  return "newFiles" in variant.images && "newPreviews" in variant.images;
}

export function createEmptyVariantForm(
  defaultPrice: number = 0,
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

export function createEmptyVariantFormUpdate(
  defaultPrice: number = 0,
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
  variant: VariantForm,
): variant is VariantFormCreate {
  return "files" in variant.images && "previews" in variant.images;
}

export function isVariantFormUpdate(
  variant: VariantForm,
): variant is VariantFormUpdate {
  return "newFiles" in variant.images && "newPreviews" in variant.images;
}

// Factory function for creating empty variant (create form)
export function createEmptyVariantForm(
  defaultPrice: number = 0,
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
  defaultPrice: number = 0,
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
