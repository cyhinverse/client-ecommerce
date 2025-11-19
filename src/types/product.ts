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
  _id: string;
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
  images: string[];
  price: price | null;
  variants: variants[];
  reviews: reviews[] | null;
  tags: string[] | null;
  soldCount: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  onSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ProductState {
  product: Product[] | null;
  currentProduct: Product;
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}
