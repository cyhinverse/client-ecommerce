/**
 * Settings Types
 * TypeScript interfaces for system settings
 */

export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logo: string;
  favicon: string;
}

export interface NotificationSettings {
  newOrders: boolean;
  lowStock: boolean;
  newUsers: boolean;
  newReviews: boolean;
  orderStatusUpdates: boolean;
}

export interface DisplaySettings {
  darkMode: boolean;
  language: string;
  currency: string;
  dateFormat: string;
  itemsPerPage: number;
}

export interface BusinessSettings {
  lowStockThreshold: number;
  orderPrefix: string;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableChat: boolean;
}

export interface Settings {
  _id: string;
  key: string;
  store: StoreSettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  business: BusinessSettings;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsPayload {
  store?: Partial<StoreSettings>;
  notifications?: Partial<NotificationSettings>;
  display?: Partial<DisplaySettings>;
  business?: Partial<BusinessSettings>;
}
