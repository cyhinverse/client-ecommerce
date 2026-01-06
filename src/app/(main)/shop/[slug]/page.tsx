// ShopPage - Taobao Light Style
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Store, 
  Star, 
  Users, 
  MessageCircle, 
  Clock, 
  Truck,
  ChevronRight,
  Search,
  Grid3X3,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/product/ProductCard";
import { toast } from "sonner";

// Mock shop data - replace with actual API
const mockShop = {
  _id: "shop1",
  name: "Apple Official Store",
  slug: "apple-official",
  logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
  banner: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200",
  description: "Cửa hàng chính hãng Apple tại Việt Nam. Cam kết 100% sản phẩm chính hãng.",
  rating: 4.9,
  followers: 125000,
  metrics: {
    responseRate: 98,
    shippingOnTime: 99,
    ratingCount: 15420,
  },
  status: "active",
};

const mockProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
    slug: "iphone-15-pro-max",
    price: { currentPrice: 34990000, discountPrice: 32990000 },
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"],
    shop: mockShop,
    soldCount: 1250,
    onSale: true,
  },
  {
    _id: "2",
    name: "MacBook Pro 14 inch M3 Pro",
    slug: "macbook-pro-14-m3",
    price: { currentPrice: 49990000, discountPrice: null },
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
    shop: mockShop,
    soldCount: 560,
    onSale: false,
  },
  {
    _id: "3",
    name: "AirPods Pro 2nd Generation",
    slug: "airpods-pro-2",
    price: { currentPrice: 6990000, discountPrice: 5990000 },
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400"],
    shop: mockShop,
    soldCount: 3200,
    onSale: true,
  },
];

const shopCategories = [
  { id: "all", name: "Tất cả", count: 156 },
  { id: "iphone", name: "iPhone", count: 24 },
  { id: "macbook", name: "MacBook", count: 18 },
  { id: "ipad", name: "iPad", count: 12 },
  { id: "accessories", name: "Phụ kiện", count: 102 },
];

export default function ShopPage() {
  const params = useParams();
  const [shop, setShop] = useState(mockShop);
  const [products, setProducts] = useState(mockProducts);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Đã bỏ theo dõi shop" : "Đã theo dõi shop");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background -mt-4 -mx-4">
      {/* Shop Banner */}
      <div className="relative h-[200px] md:h-[280px] w-full">
        <Image
          src={shop.banner}
          alt={shop.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Shop Info Card */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded border border-[#f0f0f0] p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Logo */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shrink-0 mx-auto md:mx-0">
              <Image
                src={shop.logo}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <h1 className="text-xl font-bold text-gray-800">{shop.name}</h1>
                <span className="inline-flex items-center justify-center md:justify-start gap-1 text-xs text-[#E53935] border border-[#E53935] px-2 py-0.5 rounded w-fit mx-auto md:mx-0">
                  <Store className="h-3 w-3" />
                  Official Store
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{shop.description}</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-gray-400">({formatNumber(shop.metrics.ratingCount)} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatNumber(shop.followers)}</span>
                  <span className="text-gray-400">theo dõi</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-center md:justify-end shrink-0">
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing 
                  ? "border-[#E53935] text-[#E53935] hover:bg-[#FFEBEE]" 
                  : "bg-[#E53935] hover:bg-[#D32F2F]"
                }
              >
                {isFollowing ? "Đang theo dõi" : "+ Theo dõi"}
              </Button>
              <Button variant="outline" className="border-gray-200">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#f0f0f0]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#4CAF50]">
                <MessageCircle className="h-4 w-4" />
                <span className="font-bold">{shop.metrics.responseRate}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Tỉ lệ phản hồi</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#2196F3]">
                <Clock className="h-4 w-4" />
                <span className="font-bold">Trong vài phút</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Thời gian phản hồi</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#FF9800]">
                <Truck className="h-4 w-4" />
                <span className="font-bold">{shop.metrics.shippingOnTime}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Giao đúng hạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Categories Sidebar */}
          <div className="lg:w-[200px] shrink-0">
            <div className="bg-white rounded border border-[#f0f0f0] p-3">
              <h3 className="font-medium text-gray-800 mb-2">Danh mục Shop</h3>
              <ul className="space-y-1">
                {shopCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        activeCategory === cat.id
                          ? "bg-[#FFEBEE] text-[#E53935]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                      <span className="text-gray-400 ml-1">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded border border-[#f0f0f0] p-3 mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm trong shop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 border-gray-200 focus:border-[#E53935]"
                />
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-[#FFEBEE] text-[#E53935]" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-[#FFEBEE] text-[#E53935]" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product as any} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
