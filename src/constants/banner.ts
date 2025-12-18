import { BannerItem } from "@/types/banner";

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    _id: "1",
    imageUrl: "/images/1.png",
    title: "The Future of Fluidity",
    subtitle: "Experience the ultimate collection designed for the modern era.",
    theme: "dark",
    isActive: true,
    order: 1,
  },
  {
    _id: "2",
    imageUrl: "/images/2.png",
    title: "Urban Architecture",
    subtitle: "Redefining the boundaries of street luxury and structural design.",
    theme: "light",
    isActive: true,
    order: 2,
  },
  {
    _id: "3",
    imageUrl: "/images/3.png",
    title: "Minimalist Motion",
    subtitle: "Where peak performance meets the art of absolute simplicity.",
    theme: "dark",
    isActive: true,
    order: 3,
  },
];
