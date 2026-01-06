import { Shop } from "./product";
import { PaginationData } from "./common";

// Voucher type enum
export type VoucherType = "fixed_amount" | "percentage";

// Voucher scope enum
export type VoucherScope = "shop" | "platform";

// Voucher interface - Replaces Discount
export interface Voucher {
  _id: string;
  code: string;
  name: string;
  description?: string;
  
  // Type and value
  type: VoucherType;
  value: number;
  maxValue?: number;          // Max discount for percentage type
  
  // Scope
  scope: VoucherScope;
  shopId?: string | Shop;
  
  // Usage limits
  minOrderValue: number;
  usageLimit: number;
  usageCount: number;
  usageLimitPerUser: number;
  usedBy?: string[];
  
  // Validity
  startDate: string;
  endDate: string;
  isActive: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // BACKWARD COMPATIBILITY: Old Discount field aliases
  discountType?: "percent" | "fixed";  // Maps to type
  discountValue?: number;              // Maps to value
  usedCount?: number;                  // Maps to usageCount
  applicableProducts?: string[];       // Deprecated
}

// Create voucher payload
export interface CreateVoucherData {
  code: string;
  name: string;
  description?: string;
  type: VoucherType;
  value: number;
  maxValue?: number;
  scope: VoucherScope;
  shopId?: string;
  minOrderValue?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  // BACKWARD COMPATIBILITY: Old Discount field aliases
  discountType?: "percent" | "fixed";
  discountValue?: number;
  applicableProducts?: string[];
}

// Update voucher payload
export interface UpdateVoucherData {
  code?: string;
  name?: string;
  description?: string;
  type?: VoucherType;
  value?: number;
  maxValue?: number;
  scope?: VoucherScope;
  shopId?: string;
  minOrderValue?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  // BACKWARD COMPATIBILITY: Old Discount field aliases
  discountType?: "percent" | "fixed";
  discountValue?: number;
  applicableProducts?: string[];
}

// Voucher filters for listing
export interface VoucherFilters {
  page: number;
  limit: number;
  search?: string;
  type?: VoucherType;
  scope?: VoucherScope;
  shopId?: string;
  isActive?: boolean | null;
  [key: string]: string | number | boolean | null | undefined;
}

// Apply voucher result
export interface ApplyVoucherResult {
  voucherId: string;
  code: string;
  discountAmount: number;
  type: VoucherType;
  scope: VoucherScope;
  // BACKWARD COMPATIBILITY
  finalTotal?: number;
  originalTotal?: number;
}

// Voucher state for Redux
export interface VoucherState {
  vouchers: Voucher[];
  currentVoucher: Voucher | null;
  pagination: PaginationData | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Applied vouchers in checkout
  appliedShopVoucher: ApplyVoucherResult | null;
  appliedPlatformVoucher: ApplyVoucherResult | null;
}

// Voucher statistics
export interface VoucherStatistics {
  totalVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
  shopVouchers: number;
  platformVouchers: number;
  totalUsage: number;
}

// Helper function to calculate discount
export function calculateVoucherDiscount(
  voucher: Voucher,
  orderAmount: number
): number {
  if (orderAmount < voucher.minOrderValue) return 0;
  
  if (voucher.type === "fixed_amount") {
    return Math.min(voucher.value, orderAmount);
  }
  
  // Percentage type
  const discount = (orderAmount * voucher.value) / 100;
  if (voucher.maxValue) {
    return Math.min(discount, voucher.maxValue);
  }
  return discount;
}

// Helper function to check if voucher is valid
export function isVoucherValid(voucher: Voucher): boolean {
  if (!voucher.isActive) return false;
  
  const now = new Date();
  const startDate = new Date(voucher.startDate);
  const endDate = new Date(voucher.endDate);
  
  if (now < startDate || now > endDate) return false;
  if (voucher.usageCount >= voucher.usageLimit) return false;
  
  return true;
}

// Backward compatibility - Discount aliases
export type Discount = Voucher;
export type DiscountFilters = VoucherFilters;
export type CreateDiscountData = CreateVoucherData;
export type UpdateDiscountData = UpdateVoucherData;
