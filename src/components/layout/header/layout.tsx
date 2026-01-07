"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import {
  ShoppingCart,
  Bell,
  Menu,
  MessageCircle,
  Camera,
  Trash2,
  Search,
  Loader2,
  Heart,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NotificationModel from "@/components/notifications/NotificationModel";
import { countUnreadNotification } from "@/features/notification/notificationAction";
import { toggleChat } from "@/features/chat/chatSlice";
import { searchProducts } from "@/features/product/productAction";
import { pathArray } from "@/constants/PathArray";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TopBar from "./TopBar";

// Category data with subcategories
const categories = [
  {
    name: "Men",
    slug: "men",
    subcategories: ["Shirts", "Pants", "Shoes", "Accessories"],
  },
  {
    name: "Women",
    slug: "women",
    subcategories: ["Dresses", "Tops", "Skirts", "Bags"],
  },
  {
    name: "Kids",
    slug: "children",
    subcategories: ["Boys", "Girls", "Baby"],
  },
  {
    name: "Accessories",
    slug: "accessories",
    subcategories: ["Watches", "Sunglasses", "Belts", "Wallets"],
  },
];

// Hot search keywords
const HOT_KEYWORDS = ["iPhone 16 Pro", "Váy hè", "Nike Air Max", "Mỹ phẩm", "Đồ ăn vặt"];
const SUGGESTIONS = ["Ốp iPhone 16", "Giày nam", "Áo khoác", "Bàn phím gaming"];

export default function HeaderLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, token, data } = useAppSelector((state) => state.auth);
  const { data: cartData } = useAppSelector((state) => state.cart);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const { searchResults, isSearching } = useAppSelector((state) => state.product);
  const [isOpen, setIsOpen] = useState(false);

  // Search State
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const path = usePathname();

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(countUnreadNotification());
    }
  }, [isAuthenticated, token, dispatch]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Debounced search API call
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        dispatch(searchProducts({ keyword: searchQuery.trim(), limit: 8 }));
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, dispatch]);

  // Handle outside click to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const query = term || searchQuery;
    if (query.trim()) {
      const newRecent = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 10);
      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      setIsSearchFocused(false);
      setSearchQuery("");
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (slug: string) => {
    setIsSearchFocused(false);
    setSearchQuery("");
    router.push(`/products/${slug}`);
  };

  const removeRecentSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const cartItemsCount =
    cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  if (pathArray.includes(path)) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      {/* Top Utility Bar */}
      <TopBar />

      {/* Main Header - Taobao Light Style */}
      <header className="sticky top-0 z-50 w-full bg-white pt-3 pb-0 border-b border-[#f0f0f0]">
        {/* Primary Header Row */}
        <div className="w-full mb-1">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="flex items-start justify-between gap-8 h-[75px]">
              {/* Mobile Menu & Logo */}
              <div className="flex flex-col shrink-0 pt-1">
                <div className="flex items-center gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden -ml-2"
                      >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle className="text-left text-lg font-bold text-[#E53935]">
                          Store
                        </SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-2 mt-8">
                        {categories.map((category) => (
                          <div key={category.slug} className="space-y-1">
                            <Link
                              href={`/products?category=${category.slug}`}
                              className="text-base font-medium py-2 block border-b border-border/50"
                            >
                              {category.name}
                            </Link>
                            <div className="pl-4 space-y-1">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/products?category=${category.slug}&subcategory=${sub.toLowerCase()}`}
                                  className="text-sm text-muted-foreground hover:text-foreground py-1 block"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Logo */}
                  <Link href="/" className="shrink-0 flex flex-col items-center">
                    <div className="relative w-[210px] h-[70px] overflow-hidden">
                      <Image
                        src="/images/logo.png"
                        alt="TaoBao"
                        fill
                        className="object-cover object-center scale-110 mix-blend-multiply"
                        priority
                        unoptimized
                      />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Search Bar - Taobao Style - Centered & Expanded */}
              <div
                className="hidden md:flex flex-1 justify-center relative z-50 pt-1"
                ref={searchContainerRef}
              >
                <div
                  className={cn(
                    "flex flex-col w-full max-w-[700px] transition-all duration-200 relative",
                    isSearchFocused ? "z-60" : "z-10"
                  )}
                >
                  {/* Search Input Container */}
                  <form
                    onSubmit={(e) => handleSearchSubmit(e)}
                    className={cn(
                      "flex items-center w-full h-[40px] border-2 border-[#E53935] bg-white transition-all relative z-20 hover:border-[#E53935]",
                      isSearchFocused
                        ? "rounded-t-2xl rounded-b-none border-b-0"
                        : "rounded-full"
                    )}
                  >
                    {/* Left Category Trigger (Mock) */}
                    <div className="hidden sm:flex items-center px-4 gap-1 cursor-pointer border-r border-gray-100 h-5 group">
                      <span className="text-xs font-medium text-gray-600 group-hover:text-[#E53935]">
                        Sản phẩm
                      </span>
                      <span className="text-[10px] text-gray-400 group-hover:text-[#E53935] ml-0.5 mt-0.5">
                        ▼
                      </span>
                    </div>

                    {/* Input */}
                    <div className="flex-1 flex items-center px-3 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full h-full text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium"
                      />
                      {/* Loading or Camera Icon */}
                      {isSearching ? (
                        <Loader2 className="w-5 h-5 text-[#E53935] animate-spin absolute right-2" />
                      ) : (
                        <Camera className="w-5 h-5 text-gray-400 hover:text-[#E53935] cursor-pointer absolute right-2 transition-colors" />
                      )}
                    </div>

                    {/* Search Button */}
                    <button
                      type="submit"
                      className={cn(
                        "h-[38px] px-8 bg-[#E53935] text-white text-base font-bold transition-colors -mr-[2px] -my-[2px] hover:bg-orange-600",
                        isSearchFocused ? "rounded-tr-2xl" : "rounded-r-full"
                      )}
                    >
                      Tìm kiếm
                    </button>
                  </form>

                  {/* Hot Search Links - Always Visible */}
                  <div className="flex items-center gap-4 mt-1.5 px-2 text-xs">
                    {HOT_KEYWORDS.map((text, i) => (
                      <span
                        key={i}
                        className={cn(
                          "cursor-pointer hover:text-[#E53935] transition-colors",
                          i === 0 ? "text-[#E53935] font-medium" : "text-gray-500"
                        )}
                        onClick={() => handleSearchSubmit(undefined, text)}
                      >
                        {text}
                      </span>
                    ))}
                  </div>

                  {/* Dropdown Results */}
                  {isSearchFocused && (
                    <div className="absolute top-[38px] left-0 right-0 bg-white border-2 border-t-0 border-[#E53935] rounded-b-2xl shadow-xl z-10 animate-in fade-in zoom-in-95 duration-100 origin-top max-h-[70vh] overflow-y-auto">
                      {/* Search Results - Show when typing */}
                      {searchQuery.trim().length >= 2 && (
                        <div className="p-4 border-b border-gray-100">
                          {isSearching ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 text-[#E53935] animate-spin" />
                              <span className="ml-2 text-sm text-gray-500">Đang tìm kiếm...</span>
                            </div>
                          ) : searchResults && searchResults.length > 0 ? (
                            <>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-gray-500">
                                  Kết quả tìm kiếm
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {searchResults.length} sản phẩm
                                </span>
                              </div>
                              <div className="space-y-2">
                                {searchResults.slice(0, 6).map((product: any) => (
                                  <div
                                    key={product._id}
                                    onClick={() => handleProductClick(product.slug)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                  >
                                    {/* Product Image */}
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                      <Image
                                        src={product.images?.[0] || "/images/placeholder.png"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#E53935]">
                                        {product.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm font-bold text-[#E53935]">
                                          {formatPrice(product.price?.discountPrice || product.price?.currentPrice || 0)}
                                        </span>
                                        {product.price?.discountPrice && product.price?.currentPrice > product.price?.discountPrice && (
                                          <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(product.price.currentPrice)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Search className="w-4 h-4 text-gray-300 group-hover:text-[#E53935]" />
                                  </div>
                                ))}
                              </div>
                              {/* View All Results */}
                              <button
                                onClick={() => handleSearchSubmit()}
                                className="w-full mt-3 py-2 text-sm font-medium text-[#E53935] hover:bg-[#E53935]/5 rounded-lg transition-colors"
                              >
                                Xem tất cả kết quả cho "{searchQuery}"
                              </button>
                            </>
                          ) : (
                            <div className="py-8 text-center">
                              <Search className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                Không tìm thấy sản phẩm nào cho "{searchQuery}"
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Thử tìm kiếm với từ khóa khác
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* History & Suggestions - Show when not typing */}
                      {searchQuery.trim().length < 2 && (
                        <div className="p-4">
                          {/* History */}
                          {recentSearches.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-gray-500">
                                  Lịch sử tìm kiếm
                                </h4>
                                <Trash2
                                  className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 cursor-pointer"
                                  onClick={removeRecentSearch}
                                />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term, i) => (
                                  <div
                                    key={i}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-xs text-gray-600 rounded-full cursor-pointer transition-colors"
                                    onClick={() => handleSearchSubmit(undefined, term)}
                                  >
                                    {term}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hot / Guess You Like */}
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 mb-2">
                              Có thể bạn thích
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {SUGGESTIONS.map((term) => (
                                <div
                                  key={term}
                                  className="px-3 py-1 bg-white border border-gray-200 hover:border-[#E53935] hover:text-[#E53935] text-xs text-gray-600 rounded-full cursor-pointer transition-colors"
                                  onClick={() => handleSearchSubmit(undefined, term)}
                                >
                                  {term}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions - Taobao Style Refined (Horizontal & Lighter) */}
              <div className="flex items-center gap-6 shrink-0 pt-2">
                {isAuthenticated && token ? (
                  <>
                    {/* Horizontal Layout for Actions */}
                    <div className="flex items-center gap-5">
                      {/* Wishlist */}
                      <Link
                        href="/wishlist"
                        className="group flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#E53935] transition-colors"
                      >
                        <Heart className="h-6 w-6 stroke-[1.5]" />
                        <span className="text-[10px]">Yêu thích</span>
                      </Link>

                      {/* Chat */}
                      <button
                        onClick={() => dispatch(toggleChat())}
                        className="group flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#E53935] transition-colors"
                      >
                        <MessageCircle className="h-6 w-6 stroke-[1.5]" />
                        <span className="text-[10px]">Tin nhắn</span>
                      </button>

                      {/* Notifications */}
                      <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={cn(
                          "group flex flex-col items-center gap-0.5 transition-colors relative",
                          isOpen ? "text-[#E53935]" : "text-gray-500 hover:text-[#E53935]"
                        )}
                      >
                        <div className="relative">
                          <Bell className="h-6 w-6 stroke-[1.5]" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-[#E53935] text-[9px] font-bold text-white flex items-center justify-center border border-white">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px]">Thông báo</span>
                      </button>

                      {/* Cart */}
                      <Link
                        href="/cart"
                        className="group flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#E53935] transition-colors relative"
                      >
                        <div className="relative">
                          <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
                          {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-[#E53935] text-[9px] font-bold text-white flex items-center justify-center border border-white">
                              {cartItemsCount > 99 ? "99+" : cartItemsCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px]">Giỏ hàng</span>
                      </Link>

                      {/* User */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 pl-3 border-l border-gray-200 ml-1"
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-100 group-hover:border-[#E53935] transition-colors">
                          <Image
                            alt={data?.username || "User"}
                            src={data?.avatar || "/images/CyBer.jpg"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <Link
                        href="/cart"
                        className="group flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#E53935] transition-colors relative"
                      >
                        <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
                        <span className="text-[10px]">Giỏ hàng</span>
                      </Link>

                      <div className="border-l border-gray-200 h-8 mx-2" />

                      <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 hover:text-[#E53935] transition-colors"
                      >
                        Đăng nhập
                      </Link>

                      <Link
                        href="/register"
                        className="px-5 py-2 bg-[#E53935] text-white text-sm font-medium rounded-full hover:bg-[#D32F2F] transition-all"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <NotificationModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </header>
    </>
  );
}
