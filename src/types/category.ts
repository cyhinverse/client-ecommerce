export interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  images: string[];
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  images: string[];
}

export interface Category {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  images?: string[];
  parentCategory?: ParentCategory;
  subcategories?: Category[];
  createdAt?: string;
  updatedAt: string;
  isActive: boolean;
  productCount?: number;
}

import { PaginationData } from "./common";
export type { PaginationData };

export interface CategoriesResponse {
  categories: Category[];
  pagination: PaginationData;
}

export interface CategoryFilters {
  page: number;
  limit: number;
  search: string;
  [key: string]: string | number;
}
