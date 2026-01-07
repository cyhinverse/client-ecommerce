import { PaginationData } from "./common";

// Pickup address for shop
export interface PickupAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

// Shop metrics
export interface ShopMetrics {
  responseRate: number;
  shippingOnTime: number;
  ratingCount: number;
}

// Shop status type
export type ShopStatus = "active" | "inactive" | "banned";

// Main Shop interface
export interface Shop {
  _id: string;
  owner: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  pickupAddress?: PickupAddress;
  status: ShopStatus;
  rating: number;
  metrics: ShopMetrics;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

// Create shop payload
export interface CreateShopPayload {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  pickupAddress?: PickupAddress;
}

// Update shop payload
export interface UpdateShopPayload {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  pickupAddress?: PickupAddress;
  isActive?: boolean;
}

// Shop state for Redux
export interface ShopState {
  myShop: Shop | null;
  currentShop: Shop | null;
  isLoading: boolean;
  isRegistering: boolean;
  isUpdating: boolean;
  error: string | null;
  // Image upload states
  isUploadingLogo: boolean;
  isUploadingBanner: boolean;
  uploadError: string | null;
}

// Shop filters for listing
export interface ShopFilters {
  page: number;
  limit: number;
  search?: string;
  status?: ShopStatus;
}
