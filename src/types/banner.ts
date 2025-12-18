export interface BannerItem {
  _id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link?: string;
  theme: "light" | "dark";
  isActive: boolean;
  order: number;
}

export interface CreateBannerPayload {
  title: string;
  subtitle: string;
  imageUrl: string;
  theme: "light" | "dark";
  isActive: boolean;
  order: number;
  link?: string;
  imageFile: File; // For creation, file is required
}

export interface UpdateBannerPayload {
  title: string;
  subtitle: string;
  imageUrl: string;
  theme: "light" | "dark";
  isActive: boolean;
  order: number;
  link?: string;
  imageFile: File | null; // For update, file is optional
}
