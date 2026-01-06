import { Shop, Price } from "./product";

// Product info in cart item
interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  price?: Price;
  isActive: boolean;
}

// Cart item interface - Updated with new structure
export interface CartItem {
  _id: string;
  productId: CartProduct | string;
  shopId: Shop | string;      // NEW: for grouping by shop
  modelId?: string;           // NEW: replaces variantId
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice?: number;
    currency: string;
  };
  // Variation info (derived from tierIndex)
  variationInfo?: string;     // e.g. "Color: Red, Size: M"
  selected?: boolean;
  
  // DEPRECATED: Old variant fields (kept for backward compatibility)
  variantId?: string;
  variant?: {
    _id: string;
    sku: string;
    color: string;
    size: string;
    stock: number;
    price?: Price;
    images: string[];
  };
}

// NEW: Cart items grouped by shop
export interface CartItemsByShop {
  shop: Shop;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Cart interface
export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalAmount?: number;
  cartCount?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Cart state for Redux
export interface CartState {
  data: Cart | null;
  isLoading: boolean;
  error: string | null;
  selectedItems: CartItem[];
  checkoutTotal: number;
  // NEW: Items grouped by shop for display
  itemsByShop?: CartItemsByShop[];
}

// Helper function to group cart items by shop
export function groupCartItemsByShop(items: CartItem[]): CartItemsByShop[] {
  const shopMap = new Map<string, CartItemsByShop>();
  
  items.forEach(item => {
    const shopId = typeof item.shopId === 'string' ? item.shopId : item.shopId?._id;
    const shop = typeof item.shopId === 'object' ? item.shopId : { _id: shopId, name: 'Shop' } as Shop;
    
    if (!shopId) return;
    
    if (!shopMap.has(shopId)) {
      shopMap.set(shopId, {
        shop,
        items: [],
        subtotal: 0,
        itemCount: 0
      });
    }
    
    const group = shopMap.get(shopId)!;
    group.items.push(item);
    group.subtotal += (item.price?.discountPrice || item.price?.currentPrice || 0) * item.quantity;
    group.itemCount += item.quantity;
  });
  
  return Array.from(shopMap.values());
}

// Add to cart payload
export interface AddToCartPayload {
  productId: string;
  shopId: string;
  modelId?: string;
  quantity: number;
}

// Update cart item payload
export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
