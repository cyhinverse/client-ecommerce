import { Shop } from "./product";

// Order product interface - Updated with new structure
export interface OrderProduct {
  productId: string;
  modelId?: string;           // NEW: replaces variantId
  tierIndex?: number[];       // NEW: e.g. [0, 1] for Blue, M
  name: string;
  sku?: string;
  image?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
  
  // Variation display (derived from tierIndex)
  variationInfo?: string;     // e.g. "Color: Red, Size: M"
  
  // DEPRECATED: Old variant fields (kept for backward compatibility)
  variantId?: string;
  color?: string;
  size?: string;
}

// Shipping address interface
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
}

// Order status type
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

// Order interface - Updated with new structure
export interface Order {
  _id: string;
  orderGroupId?: string;      // NEW: for multi-vendor checkout
  shopId?: string | Shop;     // NEW: which shop this order belongs to
  userId: string | { _id: string; username: string; email: string };
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  
  // Payment info
  paymentMethod: "cod" | "vnpay" | "momo";
  paymentStatus: "unpaid" | "paid" | "refunded";
  
  // Financials - Updated
  subtotal: number;
  shippingFee?: number;
  discountShop?: number;       // NEW: shop voucher discount
  discountPlatform?: number;   // NEW: platform voucher discount
  totalAmount: number;
  
  // DEPRECATED: Old discount fields (kept for backward compatibility)
  discountCode?: string;
  discountAmount?: number;
  
  // Status and tracking
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  orderCode?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}


import { PaginationData } from "./common";
export type { PaginationData };

// Order statistics interface
export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  revenueByPeriod?: Array<{
    period: string;
    revenue: number;
    orders: number;
  }>;
}

// Order filters for admin
export interface OrderFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  userId: string;
  shopId?: string;            // NEW: filter by shop
  orderGroupId?: string;      // NEW: filter by order group
  [key: string]: string | number | boolean | null | undefined;
}

// Order state for Redux
export interface OrderState {
  userOrders: Order[];
  currentOrder: Order | null;
  allOrders: Order[];
  statistics: OrderStatistics | null;
  pagination: PaginationData | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isCancelling: boolean;
  error: string | null;
}

// Order status count for stats
export interface OrderStatusCount {
  _id: string;
  count: number;
}

// Order stats props for components
export interface OrdersStatsProps {
  totalOrders?: number;
  pendingOrders?: number;
  confirmedOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  cancelledOrders?: number;
  totalRevenue?: number;
  ordersByStatus?: OrderStatusCount[];
}

// Create order payload - Updated
export interface CreateOrderPayload {
  products: Array<{
    productId: string;
    modelId?: string;
    tierIndex?: number[];
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "vnpay" | "momo";
  shopId?: string;
  voucherShopCode?: string;     // NEW: shop voucher
  voucherPlatformCode?: string; // NEW: platform voucher
}

// Order group for multi-vendor checkout
export interface OrderGroup {
  orderGroupId: string;
  orders: Order[];
  totalAmount: number;
  totalDiscountShop: number;
  totalDiscountPlatform: number;
}
