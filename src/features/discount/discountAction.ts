import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  CreateVoucherData, 
  UpdateVoucherData, 
  VoucherFilters,
  VoucherScope,
  // Backward compatibility aliases
  CreateDiscountData,
  UpdateDiscountData,
} from "@/types/voucher";
import instance from "@/api/api";

// ==================== VOUCHER ACTIONS (NEW) ====================

// Get all vouchers
export const getAllVouchers = createAsyncThunk(
  "voucher/getAllVouchers",
  async (params: Partial<VoucherFilters>) => {
    const response = await instance.get("/vouchers", { params });
    return response.data;
  }
);

// Get voucher by ID
export const getVoucherById = createAsyncThunk(
  "voucher/getVoucherById",
  async (voucherId: string) => {
    const response = await instance.get(`/vouchers/${voucherId}`);
    return response.data;
  }
);

// Create voucher
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucherData: CreateVoucherData) => {
    const response = await instance.post("/vouchers", voucherData);
    return response.data;
  }
);

// Update voucher
export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async ({ id, ...updateData }: UpdateVoucherData & { id: string }) => {
    const response = await instance.put(`/vouchers/${id}`, updateData);
    return response.data;
  }
);

// Delete voucher
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (voucherId: string) => {
    await instance.delete(`/vouchers/${voucherId}`);
    return voucherId;
  }
);

// Get voucher statistics
export const getVoucherStatistics = createAsyncThunk(
  "voucher/getVoucherStatistics",
  async () => {
    const response = await instance.get("/vouchers/statistics");
    return response.data;
  }
);

// Apply voucher code
export const applyVoucherCode = createAsyncThunk(
  "voucher/applyVoucherCode",
  async ({
    code,
    orderTotal,
    shopId,
  }: {
    code: string;
    orderTotal: number;
    shopId?: string;
  }) => {
    const response = await instance.post("/vouchers/apply", {
      code,
      orderTotal,
      shopId,
    });
    return response.data;
  }
);

// Get available vouchers for checkout
export const getAvailableVouchers = createAsyncThunk(
  "voucher/getAvailableVouchers",
  async ({
    orderTotal,
    shopId,
    scope,
  }: {
    orderTotal: number;
    shopId?: string;
    scope?: VoucherScope;
  }) => {
    const response = await instance.get("/vouchers/available", {
      params: { orderTotal, shopId, scope },
    });
    return response.data;
  }
);

// ==================== BACKWARD COMPATIBILITY ALIASES ====================
// These map old discount actions to new voucher actions

export const getAllDiscounts = getAllVouchers;
export const getDiscountById = getVoucherById;
export const createDiscount = createVoucher;
export const updateDiscount = updateVoucher;
export const deleteDiscount = deleteVoucher;
export const getDiscountStatistics = getVoucherStatistics;

// Apply discount code (backward compatible)
export const applyDiscountCode = createAsyncThunk(
  "discount/applyDiscountCode",
  async ({
    code,
    orderTotal,
    productIds,
  }: {
    code: string;
    orderTotal: number;
    productIds: string[];
  }) => {
    // Use voucher endpoint
    const response = await instance.post("/vouchers/apply", {
      code,
      orderTotal,
    });
    return response.data;
  }
);
