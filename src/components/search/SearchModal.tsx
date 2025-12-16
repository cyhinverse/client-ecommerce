"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  X,
  Loader2,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { searchProducts } from "@/features/product/productAction";
import { useRouter } from "next/navigation";
import { price } from "@/types/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Áo thun",
  "Quần jeans",
  "Váy đầm",
  "Giày sneaker",
  "Túi xách",
  "Đồng hồ",
];

const TRENDING_CATEGORIES = [
  { name: "Thời trang nam", href: "/categories/thoi-trang-nam" },
  { name: "Thời trang nữ", href: "/categories/thoi-trang-nu" },
  { name: "Phụ kiện", href: "/categories/phu-kien" },
  { name: "Giày dép", href: "/categories/giay-dep" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchResults, isSearching } = useAppSelector(
    (state) => state.product
  );

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    );
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter((s) => s !== term);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  // Debounce search to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      return;
    }
    dispatch(searchProducts({ keyword: debouncedSearchQuery, limit: 5 }));
  }, [debouncedSearchQuery, dispatch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle close with reset
  const handleClose = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  // Handle product click
  const handleProductClick = (slug: string) => {
    saveRecentSearch(searchQuery);
    handleClose();
    router.push(`/products/${slug}`);
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const query = term || searchQuery;
    if (query.trim()) {
      saveRecentSearch(query);
      handleClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Format price in VND
  const formatPrice = (price: price | null) => {
    const actualPrice = price?.discountPrice || price?.currentPrice || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(actualPrice);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-background rounded-xl w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b shrink-0 bg-background/95 backdrop-blur">
          <Search className="w-5 h-5 text-muted-foreground" />
          <form onSubmit={(e) => handleSearchSubmit(e)} className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg px-0 shadow-none h-11"
            />
          </form>
          {isSearching && (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Empty State - Show Recent & Popular */}
            {!searchQuery && (
              <div className="space-y-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Tìm kiếm gần đây</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs hover:bg-transparent hover:text-destructive"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem("recentSearches");
                        }}
                      >
                        Xóa lịch sử
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="group flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full text-sm transition-colors cursor-pointer border border-transparent hover:border-border"
                          onClick={() => handleSearchSubmit(undefined, term)}
                        >
                          <span>{term}</span>
                          <X
                            className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                            onClick={(e) => removeRecentSearch(term, e)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Tìm kiếm phổ biến</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-normal"
                        onClick={() => handleSearchSubmit(undefined, term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Trending Categories */}
                <div className="space-y-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Danh mục nổi bật
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {TRENDING_CATEGORIES.map((category) => (
                      <div
                        key={category.href}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-accent transition-all cursor-pointer group"
                        onClick={() => {
                          router.push(category.href);
                          handleClose();
                        }}
                      >
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-2">
                {isSearching ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      Kết quả cho &quot;
                      <span className="font-medium text-foreground">
                        {searchQuery}
                      </span>
                      &quot;
                    </p>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
                        onClick={() => handleProductClick(product.slug)}
                      >
                        <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center shrink-0 overflow-hidden border">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              width={56}
                              height={56}
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground/70">
                              No Image
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {typeof product.category === "string"
                              ? product.category
                              : product.category?.name || "Chưa phân loại"}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-foreground shrink-0">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5"
                      onClick={(e) => handleSearchSubmit(e)}
                    >
                      Xem tất cả kết quả
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Không tìm thấy sản phẩm nào cho &quot;{searchQuery}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
