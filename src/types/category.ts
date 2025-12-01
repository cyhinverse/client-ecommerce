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
