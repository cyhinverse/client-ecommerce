import { User } from "./auth";

export interface category {
  _id: string;
  name: string;
  slug: string;
}

export interface price {
  currentPrice: number;
  discountPrice: number;
  currency: string;
  _id?: string;
}

export interface reviews extends User {
  _id: string;
  rating: number;
  comment: string;
}
export interface variants {
  sku: string;
  color: string;
  size: string;
  stock: number;
  images: string[];
  price?: price;
  _id: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  slug: string;
  category: category | null;
  brand: string;
  price: price | null;
  variants: variants[];
  reviews: reviews[] | null;
  tags: string[] | null;
  soldCount: number;
  averageRating?: number;
  numberOfReviews?: number;
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  onSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

import { PaginationData } from "./common";
export type { PaginationData };

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
};

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
  rating: string; // Comma separated
  colors: string; // Comma separated
  sizes: string; // Comma separated
  sortBy: string;
  [key: string]: string | number | boolean | null;
}
