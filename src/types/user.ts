import { Address } from "./address";

export interface address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  roles: string;
  permissions: string[];
  phone: string;
  avatar: string | null;
  isVerifiedEmail: boolean;
  provider: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  codeVerifiEmail?: string;
  expiresCodeVerifiEmail?: string;
  isTwoFactorEnabled?: boolean;
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

export interface UserState {
  user: User[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserFilters {
  page: number;
  limit: number;
  search: string;
  role: string;
  isVerifiedEmail: boolean | null;
  [key: string]: string | number | boolean | null;
}
