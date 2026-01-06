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
  const DEFAULT_SHOP_ID = 'default-shop';
  
  items.forEach(item => {
    // Try to get shopId from item.shopId or from productId.shop
    let shopId: string | undefined;
    let shop: Shop;
    
    if (item.shopId) {
      shopId = typeof item.shopId === 'string' ? item.shopId : item.shopId?._id;
      shop = typeof item.shopId === 'object' ? item.shopId : { _id: shopId || DEFAULT_SHOP_ID, name: 'Shop' } as Shop;
    } else if (typeof item.productId === 'object' && (item.productId as any).shop) {
      // Fallback: try to get shop from productId
      const productShop = (item.productId as any).shop;
      shopId = typeof productShop === 'string' ? productShop : productShop?._id;
      shop = typeof productShop === 'object' ? productShop : { _id: shopId || DEFAULT_SHOP_ID, name: 'Shop' } as Shop;
    } else {
      // Default shop for items without shopId
      shopId = DEFAULT_SHOP_ID;
      shop = { _id: DEFAULT_SHOP_ID, name: 'Shop' } as Shop;
    }

    // Ensure shopId is always defined
    const resolvedShopId = shopId || DEFAULT_SHOP_ID;
    
    if (!shopMap.has(resolvedShopId)) {
      shopMap.set(resolvedShopId, {
        shop,
        items: [],
        subtotal: 0,
        itemCount: 0
      });
    }
    
    const group = shopMap.get(resolvedShopId)!;
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
