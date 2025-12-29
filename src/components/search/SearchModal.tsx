"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  X,
  Loader2,
  Clock,
  ArrowRight,
  ShoppingBag,
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
  "T-shirt",
  "Jeans",
  "Dress",
  "Sneakers",
  "Handbag",
  "Watch",
];

const TRENDING_CATEGORIES = [
  { name: "Men's Fashion", href: "/categories/thoi-trang-nam" },
  { name: "Women's Fashion", href: "/categories/thoi-trang-nu" },
  { name: "Accessories", href: "/categories/phu-kien" },
  { name: "Footwear", href: "/categories/giay-dep" },
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    }).format(actualPrice);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
          <Search className="w-5 h-5 text-muted-foreground/70" />
          <form onSubmit={(e) => handleSearchSubmit(e)} className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg px-0 shadow-none h-12 bg-transparent placeholder:text-muted-foreground/50"
            />
          </form>
          <div className="flex items-center gap-2">
            {isSearching && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:bg-muted/50 rounded-full h-8 px-3"
            >
              ESC
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[300px] max-h-[60vh] overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-2">
              {/* Empty State - Show Recent & Popular */}
              {!searchQuery && (
                <div className="p-4 space-y-8">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-2">
                        <span>Recent Searches</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs hover:bg-transparent hover:text-destructive font-normal"
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("recentSearches");
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="grid gap-1">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            className="group flex items-center justify-between px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors text-sm"
                            onClick={() => handleSearchSubmit(undefined, term)}
                          >
                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{term}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-muted/80 hover:text-destructive rounded-full"
                                onClick={(e) => removeRecentSearch(term, e)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-2">
                        Popular on Store
                    </div>
                    <div className="flex flex-wrap gap-2 px-1">
                      {POPULAR_SEARCHES.map((term) => (
                        <Badge
                          key={term}
                          variant="secondary"
                          className="px-3 py-1.5 cursor-pointer bg-muted/30 hover:bg-primary/10 hover:text-primary transition-colors text-sm font-normal border-transparent"
                          onClick={() => handleSearchSubmit(undefined, term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Trending Categories */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-2">
                        Browse Categories
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TRENDING_CATEGORIES.map((category) => (
                        <div
                          key={category.href}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/50 hover:bg-accent hover:border-accent transition-all cursor-pointer group"
                          onClick={() => {
                            router.push(category.href);
                            handleClose();
                          }}
                        >
                           <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                           </div>
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery && (
                <div className="py-2">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p className="text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                        Products
                      </div>
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-4 px-3 py-2 mx-2 hover:bg-muted/60 rounded-xl cursor-pointer transition-colors group"
                          onClick={() => handleProductClick(product.slug)}
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                            {product.variants?.[0]?.images?.[0] ? (
                              <Image
                                width={48}
                                height={48}
                                src={product.variants[0].images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground/90 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {typeof product.category === "string"
                                ? product.category
                                : product.category?.name || "Uncategorized"}
                            </p>
                          </div>
                          <div className="text-sm font-medium tabular-nums text-foreground/80">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      ))}

                      <div className="p-2 mt-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-between group text-primary hover:text-primary hover:bg-primary/5"
                            onClick={(e) => handleSearchSubmit(e)}
                        >
                            <span className="text-sm">View all results for &quot;{searchQuery}&quot;</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                      <div className="bg-muted/50 p-4 rounded-full mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-semibold">No results found</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different keyword.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
