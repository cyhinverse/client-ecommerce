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
  ward?: string;
  district?: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId: string | { _id: string; username: string; email: string };
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'vnpay';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  subtotal: number;
  shippingFee: number;
  discountCode?: string;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveredAt?: Date;
  createdAt: string;
  updatedAt: string;
  __v?: number;
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


// Types cho API requests
export interface CreateOrderRequest {
  userId: string;
  products: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'vnpay';
  discountCode?: string;
}

export interface UpdateOrderRequest {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  shippingFee?: number;
  discountAmount?: number;
  deliveredAt?: Date;
}
