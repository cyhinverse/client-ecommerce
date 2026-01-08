import { User } from "./auth";

// Category interface
export interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Price interface
export interface Price {
  currentPrice: number;
  discountPrice?: number | null;
  currency: string;
  _id?: string;
}

// Review interface
export interface Review extends User {
  _id: string;
  rating: number;
  comment: string;
}

// Simple Variant interface - color variants only
// Size is at product level, material is in attributes
export interface Variant {
  _id: string;
  name: string;                    // Display name (usually same as color)
  sku?: string;                    // Auto-generated: {slug}-{color}-{index}
  color?: string;                  // Color value (e.g., "Đỏ", "Xanh", "Đen")
  price: number;
  stock: number;
  sold?: number;
  images: string[];                // Variant-specific images
}

// DEPRECATED: Old VariantAttributes interface (kept for backward compatibility)
export interface VariantAttributes {
  color?: string;
  size?: string;
  material?: string;
}

// DEPRECATED: Old TierVariation interface (kept for backward compatibility during migration)
export interface TierVariation {
  name: string;
  options: string[];
  images?: (string | string[])[];
}

// DEPRECATED: Old ProductModel interface (kept for backward compatibility during migration)
export interface ProductModel {
  _id: string;
  sku?: string;
  tierIndex: number[];
  price: number;
  stock: number;
  sold?: number;
}

// NEW: Shop interface
export interface Shop {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
}

// NEW: Shop Category interface
export interface ShopCategory {
  _id: string;
  name: string;
  slug?: string;
}

// NEW: Product Dimensions
export interface ProductDimensions {
  height?: number;
  width?: number;
  length?: number;
}

// NEW: Product Attribute (for specifications/parameters)
export interface ProductAttribute {
  name: string;   // e.g. "Material", "Weight", "Color"
  value: string;  // e.g. "Cotton", "500g", "Red"
}

// NEW: Flash Sale Info
export interface FlashSaleInfo {
  isActive: boolean;
  salePrice?: number;
  discountPercent?: number;
  stock?: number;
  soldCount?: number;
  startTime?: string;
  endTime?: string;
}

// DEPRECATED: Old variants interface (kept for backward compatibility)
export interface OldVariant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  images: string[];
  price?: Price;
  _id: string;
}

// Product interface - Optimized structure
export interface Product {
  _id: string;
  name: string;
  description: string;
  slug: string;
  
  // Media - Product images are stored in variants[].images
  descriptionImages?: string[];  // Detail/infographic images (max 20)
  video?: string;
  
  // Relations
  shop?: Shop | string;
  category: Category | null;
  shopCategory?: ShopCategory | string;
  
  // Metadata
  brand?: string;
  tags?: string[];
  
  // Sizes - Product level (applies to all variants)
  // Example: ["S", "M", "L", "XL"] or ["36", "37", "38", "39", "40"]
  sizes?: string[];
  
  // Pricing & Inventory (cached aggregates)
  price: Price | null;
  stock?: number;
  soldCount: number;
  
  // Color Variants (size is at product level)
  variants: Variant[];
  
  // DEPRECATED: Old Taobao-style variations (kept for backward compatibility)
  tierVariations?: TierVariation[];
  models?: ProductModel[];
  
  // Shipping
  shippingTemplate?: string;
  weight?: number;  // grams
  dimensions?: ProductDimensions;
  
  // Specifications
  attributes?: ProductAttribute[];
  
  // Reviews (cached counters - actual reviews in Review collection)
  ratingAverage?: number;
  reviewCount?: number;
  
  // Flash Sale
  flashSale?: FlashSaleInfo;
  
  // Flags
  isFeatured?: boolean;
  isNewArrival?: boolean;
  
  // Status - Single source of truth
  status?: "draft" | "published" | "suspended" | "deleted";
  
  // Virtuals (computed by backend)
  onSale?: boolean;      // Derived from price.discountPrice or flashSale
  isActive?: boolean;    // Derived from status === "published"
  effectivePrice?: number; // Considering flash sale
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}


import { PaginationData } from "./common";
export type { PaginationData };

// Product State for Redux
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

// Query params for product listing
export type Params = {
  page: number;
  limit: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  rating?: string;
  colors?: string;
  sizes?: string;
  category?: string;
};

// Product filters for frontend
export interface ProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

// Admin product filters
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

// URL-based product filters
export interface ProductUrlFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  rating: string; // Comma separated
  colors: string; // Comma separated
  sizes: string; // Comma separated
  sortBy: string;
  [key: string]: string | number | boolean | null;
}

// Helper function to get variant display name
export function getVariantDisplay(variant: Variant): string {
  // New simplified structure - just use name or color
  if (variant.name) return variant.name;
  if (variant.color) return variant.color;
  return "Mặc định";
}

// Helper function to find variant by color
export function findVariantByColor(
  product: Product, 
  color: string
): Variant | undefined {
  return product.variants?.find(v => v.color === color);
}

// Get unique colors from variants
export function getUniqueColors(variants: Variant[]): string[] {
  const colors = new Set<string>();
  variants.forEach(v => {
    if (v.color) colors.add(v.color);
  });
  return Array.from(colors);
}

// DEPRECATED: Helper function to get variation display from model (old structure)
export function getVariationDisplay(product: Product, model: ProductModel): string {
  if (!product.tierVariations || !model.tierIndex) return "";
  return model.tierIndex.map((idx, i) => {
    const tier = product.tierVariations![i];
    if (!tier) return "";
    return `${tier.name}: ${tier.options[idx] || ""}`;
  }).filter(Boolean).join(", ");
}

// DEPRECATED: Helper function to find model by tierIndex (old structure)
export function findModelByTierIndex(product: Product, tierIndex: number[]): ProductModel | undefined {
  return product.models?.find(model => 
    model.tierIndex.length === tierIndex.length &&
    model.tierIndex.every((val, idx) => val === tierIndex[idx])
  );
}

// ============================================================================
// Form-specific types for variant handling with local file management
// ============================================================================

/**
 * Image structure for Create form variants
 * Used when creating new products - all images are new files
 */
export interface VariantImagesCreate {
  files: File[];      // New files to upload
  previews: string[]; // Object URLs for preview
  existing: string[]; // Always empty for create (kept for type compatibility)
}

/**
 * Image structure for Update form variants
 * Used when editing existing products - mix of existing URLs and new files
 */
export interface VariantImagesUpdate {
  existing: string[];    // URLs from server (existing images)
  newFiles: File[];      // New files to upload
  newPreviews: string[]; // Object URLs for new file previews
}

/**
 * Variant with local file handling for Create form
 * Extends base Variant but replaces images with file handling structure
 */
export interface VariantWithFilesCreate extends Omit<Variant, '_id' | 'images'> {
  _id: string;                    // Temporary ID (e.g., "temp-1234567890")
  images: VariantImagesCreate;
}

/**
 * Variant with local file handling for Update form
 * Includes both existing images from server and new files to upload
 */
export interface VariantWithFilesUpdate {
  _id: string;                    // Real ID from server or temp ID for new variants
  name: string;
  color?: string;                 // Color value
  price: number;
  stock: number;
  sold?: number;
  images: VariantImagesUpdate;
}

/**
 * Union type for form handling - can be either Create or Update variant
 */
export type VariantWithFiles = VariantWithFilesCreate | VariantWithFilesUpdate;

/**
 * Type guard to check if variant is for Create form
 */
export function isVariantForCreate(
  variant: VariantWithFiles
): variant is VariantWithFilesCreate {
  return 'files' in variant.images && 'previews' in variant.images;
}

/**
 * Type guard to check if variant is for Update form
 */
export function isVariantForUpdate(
  variant: VariantWithFiles
): variant is VariantWithFilesUpdate {
  return 'newFiles' in variant.images && 'newPreviews' in variant.images;
}

/**
 * Create a new empty variant for Create form
 */
export function createEmptyVariantForCreate(defaultPrice: number = 0): VariantWithFilesCreate {
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

/**
 * Create a new empty variant for Update form
 */
export function createEmptyVariantForUpdate(defaultPrice: number = 0): VariantWithFilesUpdate {
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

/**
 * Convert server Variant to VariantWithFilesUpdate for editing
 */
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
