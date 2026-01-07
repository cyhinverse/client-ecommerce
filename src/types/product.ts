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

// NEW: TierVariation interface (replaces old variants structure)
export interface TierVariation {
  name: string;           // e.g. "Color", "Size"
  options: string[];      // e.g. ["Red", "Blue", "Green"]
  images?: string[];      // Optional images for each option
}

// NEW: ProductModel interface (SKU with tierIndex mapping)
export interface ProductModel {
  _id: string;
  sku?: string;
  tierIndex: number[];    // e.g. [0, 1] means Color[0], Size[1]
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
export interface Variant {
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
  
  // Media
  images: string[];              // Product gallery images (max 10)
  descriptionImages?: string[];  // Detail/infographic images (max 20)
  video?: string;
  
  // Relations
  shop?: Shop | string;
  category: Category | null;
  shopCategory?: string;
  
  // Metadata
  brand?: string;
  tags?: string[];
  
  // Pricing & Inventory (cached aggregates)
  price: Price | null;
  stock?: number;
  soldCount: number;
  
  // Variations (Taobao-style)
  tierVariations: TierVariation[];
  models: ProductModel[];
  
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
  
  // DEPRECATED: Old variants (remove after migration)
  variants?: Variant[];
  
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

// Helper function to get variation display from model
export function getVariationDisplay(product: Product, model: ProductModel): string {
  if (!product.tierVariations || !model.tierIndex) return "";
  return model.tierIndex.map((idx, i) => {
    const tier = product.tierVariations[i];
    if (!tier) return "";
    return `${tier.name}: ${tier.options[idx] || ""}`;
  }).filter(Boolean).join(", ");
}

// Helper function to find model by tierIndex
export function findModelByTierIndex(product: Product, tierIndex: number[]): ProductModel | undefined {
  return product.models?.find(model => 
    model.tierIndex.length === tierIndex.length &&
    model.tierIndex.every((val, idx) => val === tierIndex[idx])
  );
}

// Backward compatibility aliases
export type category = Category;
export type price = Price;
export type reviews = Review;
export type variants = Variant;
