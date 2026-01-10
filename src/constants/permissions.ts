/**
 * Permission System Constants
 * Defines all permissions, resources, actions, and role-based permission mappings
 * Must be kept in sync with server-side permission definitions
 */

/**
 * All available resources in the system
 */
export const RESOURCES = {
  PRODUCT: 'product',
  ORDER: 'order',
  USER: 'user',
  SHOP: 'shop',
  CATEGORY: 'category',
  VOUCHER: 'voucher',
  BANNER: 'banner',
  NOTIFICATION: 'notification',
  FLASH_SALE: 'flash-sale',
  REVIEW: 'review',
  CART: 'cart',
  WISHLIST: 'wishlist',
  SHIPPING: 'shipping',
  STATISTICS: 'statistics',
  CHAT: 'chat',
  SHOP_CATEGORY: 'shop-category',
  PAYMENT: 'payment',
} as const;

/**
 * All available actions
 */
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

/**
 * Generate permission string from resource and action
 */
export const permission = (resource: string, action: string): string => 
  `${resource}:${action}`;

/**
 * All permissions organized by category
 */
export const PERMISSIONS = {
  // Special permissions
  ADMIN_ACCESS: 'admin:access',
  SELLER_ACCESS: 'seller:access',

  // Product permissions
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_MANAGE: 'product:manage',

  // Order permissions
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_MANAGE: 'order:manage',

  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Shop permissions
  SHOP_CREATE: 'shop:create',
  SHOP_READ: 'shop:read',
  SHOP_UPDATE: 'shop:update',
  SHOP_DELETE: 'shop:delete',
  SHOP_MANAGE: 'shop:manage',

  // Category permissions
  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',
  CATEGORY_MANAGE: 'category:manage',

  // Voucher permissions
  VOUCHER_CREATE: 'voucher:create',
  VOUCHER_READ: 'voucher:read',
  VOUCHER_UPDATE: 'voucher:update',
  VOUCHER_DELETE: 'voucher:delete',
  VOUCHER_MANAGE: 'voucher:manage',

  // Banner permissions
  BANNER_CREATE: 'banner:create',
  BANNER_READ: 'banner:read',
  BANNER_UPDATE: 'banner:update',
  BANNER_DELETE: 'banner:delete',
  BANNER_MANAGE: 'banner:manage',

  // Notification permissions
  NOTIFICATION_CREATE: 'notification:create',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_UPDATE: 'notification:update',
  NOTIFICATION_DELETE: 'notification:delete',
  NOTIFICATION_MANAGE: 'notification:manage',

  // Flash Sale permissions
  FLASH_SALE_CREATE: 'flash-sale:create',
  FLASH_SALE_READ: 'flash-sale:read',
  FLASH_SALE_UPDATE: 'flash-sale:update',
  FLASH_SALE_DELETE: 'flash-sale:delete',
  FLASH_SALE_MANAGE: 'flash-sale:manage',

  // Review permissions
  REVIEW_CREATE: 'review:create',
  REVIEW_READ: 'review:read',
  REVIEW_UPDATE: 'review:update',
  REVIEW_DELETE: 'review:delete',
  REVIEW_MANAGE: 'review:manage',

  // Cart permissions
  CART_CREATE: 'cart:create',
  CART_READ: 'cart:read',
  CART_UPDATE: 'cart:update',
  CART_DELETE: 'cart:delete',
  CART_MANAGE: 'cart:manage',

  // Wishlist permissions
  WISHLIST_CREATE: 'wishlist:create',
  WISHLIST_READ: 'wishlist:read',
  WISHLIST_UPDATE: 'wishlist:update',
  WISHLIST_DELETE: 'wishlist:delete',
  WISHLIST_MANAGE: 'wishlist:manage',

  // Shipping permissions
  SHIPPING_CREATE: 'shipping:create',
  SHIPPING_READ: 'shipping:read',
  SHIPPING_UPDATE: 'shipping:update',
  SHIPPING_DELETE: 'shipping:delete',
  SHIPPING_MANAGE: 'shipping:manage',

  // Statistics permissions
  STATISTICS_READ: 'statistics:read',
  STATISTICS_MANAGE: 'statistics:manage',

  // Chat permissions
  CHAT_CREATE: 'chat:create',
  CHAT_READ: 'chat:read',
  CHAT_MANAGE: 'chat:manage',

  // Shop Category permissions
  SHOP_CATEGORY_CREATE: 'shop-category:create',
  SHOP_CATEGORY_READ: 'shop-category:read',
  SHOP_CATEGORY_UPDATE: 'shop-category:update',
  SHOP_CATEGORY_DELETE: 'shop-category:delete',
  SHOP_CATEGORY_MANAGE: 'shop-category:manage',

  // Payment permissions
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_READ: 'payment:read',
  PAYMENT_MANAGE: 'payment:manage',
} as const;

// Type definitions
export type Resource = typeof RESOURCES[keyof typeof RESOURCES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Get all permissions as array
 */
export const getAllPermissions = (): string[] => Object.values(PERMISSIONS);

/**
 * Get permissions grouped by resource
 */
export const getPermissionsByResource = (): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};
  
  for (const perm of Object.values(PERMISSIONS)) {
    if (perm.includes(':')) {
      const [resource] = perm.split(':');
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(perm);
    }
  }
  
  return grouped;
};

/**
 * Check if a permission string is valid
 */
export const isValidPermission = (perm: string): boolean => {
  if (!perm) return false;
  if (perm === '*') return true;
  return getAllPermissions().includes(perm);
};
