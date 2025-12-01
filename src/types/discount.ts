export interface Discount {
  _id: string;
  code: string;
  description?: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[];
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountData {
  code: string;
  description?: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableProducts?: string[];
  minOrderValue?: number;
  usageLimit?: number;
  isActive?: boolean;
}

export interface DiscountFilters {
  page: number;
  limit: number;
  search: string;
  discountType: string;
  isActive: boolean | null;
  [key: string]: string | number | boolean | null;
}

export interface UpdateDiscountData {
  code?: string;
  description?: string;
  discountType?: "percent" | "fixed";
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  applicableProducts?: string[];
  minOrderValue?: number;
  usageLimit?: number;
  isActive?: boolean;
}