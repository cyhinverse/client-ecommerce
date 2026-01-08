import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  CreateVoucherData, 
  UpdateVoucherData, 
  VoucherFilters,
  VoucherScope,
} from "@/types/voucher";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";

// Get all vouchers
export const getAllVouchers = createAsyncThunk(
  "voucher/getAllVouchers",
  async (params: Partial<VoucherFilters>, { rejectWithValue }) => {
    try {
      const response = await instance.get("/vouchers", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get voucher by ID
export const getVoucherById = createAsyncThunk(
  "voucher/getVoucherById",
  async (voucherId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/vouchers/${voucherId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Create voucher
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucherData: CreateVoucherData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/vouchers", voucherData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Update voucher
export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async ({ id, ...updateData }: UpdateVoucherData & { id: string }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/vouchers/${id}`, updateData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Delete voucher
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (voucherId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/vouchers/${voucherId}`);
      return voucherId;
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);


// Get voucher statistics
export const getVoucherStatistics = createAsyncThunk(
  "voucher/getVoucherStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/vouchers/statistics");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
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
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/vouchers/apply", {
        code,
        orderValue: orderTotal, // Server expects 'orderValue', not 'orderTotal'
        shopId,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
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
  }, { rejectWithValue }) => {
    try {
      const response = await instance.get("/vouchers/available", {
        params: { orderTotal, shopId, scope },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
