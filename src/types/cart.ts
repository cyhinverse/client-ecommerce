import { Shop, Price, Variant } from "./product";

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
  // NEW: variants for getting images
  variants?: Variant[];
}

// Variant info in cart item (populated from server)
interface CartVariant {
  _id: string;
  name: string;
  color?: string;
  images?: string[];
  price?: number;
  stock?: number;
}

// Cart item interface - Updated with new structure
export interface CartItem {
  _id: string;
  productId: CartProduct | string | null;  // Can be null if product was deleted
  shopId: Shop | string;      // NEW: for grouping by shop
  modelId?: string;           // NEW: replaces variantId
  variantId?: string;         // Variant ID reference
  variant?: CartVariant;      // Populated variant info
  size?: string;              // Selected size
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice?: number;
    currency: string;
  };
  // Variation info (derived from tierIndex)
  variationInfo?: string;     // e.g. "Color: Red, Size: M"
  selected?: boolean;
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
    let shopId: string | undefined;
    let shop: Shop;
    
    // Priority 1: Get shop from productId.shop (populated with full info)
    if (typeof item.productId === 'object' && (item.productId as any).shop) {
      const productShop = (item.productId as any).shop;
      if (typeof productShop === 'object' && productShop?.name) {
        shopId = productShop._id;
        shop = productShop as Shop;
      } else {
        shopId = typeof productShop === 'string' ? productShop : productShop?._id;
        shop = { _id: shopId || DEFAULT_SHOP_ID, name: 'Shop' } as Shop;
      }
    }
    // Priority 2: Get from item.shopId (populated)
    else if (item.shopId && typeof item.shopId === 'object' && (item.shopId as Shop)?.name) {
      shopId = (item.shopId as Shop)._id;
      shop = item.shopId as Shop;
    }
    // Priority 3: item.shopId is string
    else if (item.shopId && typeof item.shopId === 'string') {
      shopId = item.shopId;
      shop = { _id: shopId, name: 'Shop' } as Shop;
    }
    // Default
    else {
      shopId = DEFAULT_SHOP_ID;
      shop = { _id: DEFAULT_SHOP_ID, name: 'Shop' } as Shop;
    }

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
  size?: string;  // Product-level size selection
}

// Update cart item payload
export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
