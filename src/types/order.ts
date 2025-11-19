export interface OrderProduct {
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  image?: string;
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice?: number;
    currency: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId: string | { _id: string; username: string; email: string };
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "unpaid" | "paid" | "refunded";
  subtotal: number;
  shippingFee: number;
  discountCode?: string;
  discountAmount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  orderCode?: string;
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

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
  }>;
}

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




export interface OrderStatusCount {
  _id: string;
  count: number;
}

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