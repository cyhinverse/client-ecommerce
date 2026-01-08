import { createSlice } from "@reduxjs/toolkit";
import { getDashboardStats } from "./statisticsAction";

interface DashboardStats {
  counts: {
    revenue: number;
    orders: number;
    users: number;
    products: number;
  };
  recentOrders: {
    _id: string;
    userId: {
      username: string;
      email: string;
      avatar: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: {
    _id: string;
    name: string;
    price: {
      currentPrice: number;
      discountPrice: number;
    };
    soldCount: number;
    slug: string;
    variants?: {
      images?: string[];
    }[];
  }[];
  chartData: {
    month: string;
    revenue: number;
    orders: number;
  }[];
}

interface StatisticsState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashboardStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDashboardStats.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      state.stats = action.payload;
    });
    builder.addCase(getDashboardStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

// Selector
export const selectStatistics = (state: any) => state.statistics;
