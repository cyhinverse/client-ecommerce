// components/search/SearchModal.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { searchProducts } from "@/features/product/productAction";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchResults, isSearching } = useAppSelector((state) => state.product);

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    if (searchQuery.trim() === "") {
      return;
    }

    const debounceTimer = setTimeout(() => {
      dispatch(searchProducts({ keyword: searchQuery, limit: 10 }));
    }, 300); 

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, dispatch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
    handleClose();
    router.push(`/${slug}`);
  };

  // Format price in VND
  const formatPrice = (price: any) => {
    const actualPrice = price?.discountPrice || price?.currentPrice || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(actualPrice);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-lg max-h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            ref={inputRef}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          {isSearching && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Results */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">
            {isSearching && searchQuery.trim() && (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Đang tìm kiếm...
              </div>
            )}
            {!isSearching && searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          width={64}
                          height={64}
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category?.name || "Chưa phân loại"}
                      </p>
                    </div>
                    <div className="text-base font-semibold text-gray-900 flex-shrink-0">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isSearching && searchQuery.trim() ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy sản phẩm "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nhập từ khóa để tìm kiếm sản phẩm
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
