interface Product {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  price: {
    currentPrice: number;
    discountPrice: number;
    currency: string;
    _id: string;
  };
  isActive: boolean;
}

interface Variant {
  _id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: {
    currentPrice: number;
    discountPrice: number;
    currency: string;
    _id: string;
  };
  images: string[];
}

export interface CartItem {
  _id: string;
  productId: Product;
  variantId: string;
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice: number;
    currency: string;
  };
  variant?: Variant;
  selected?: boolean; 
}

interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CartState {
  data: Cart | null;
  isLoading: boolean;
  error: string | null;
  selectedItems: CartItem[]; 
  checkoutTotal: number; 
}