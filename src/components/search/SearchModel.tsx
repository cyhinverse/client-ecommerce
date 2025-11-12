// components/search/SearchModal.tsx
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Danh sách sản phẩm mẫu
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 999,
      image: "/images/iphone.jpg",
      category: "Điện thoại",
    },
    {
      id: "2",
      name: "MacBook Air M2",
      price: 1299,
      image: "/images/macbook.jpg",
      category: "Laptop",
    },
    {
      id: "3",
      name: "Air Jordan 1",
      price: 150,
      image: "/images/jordan.jpg",
      category: "Giày",
    },
    {
      id: "4",
      name: "Samsung Galaxy S24",
      price: 899,
      image: "/images/samsung.jpg",
      category: "Điện thoại",
    },
  ];

  // Tính toán sản phẩm được lọc trực tiếp thay vì dùng useEffect
  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() === "") {
      return [];
    }
    return sampleProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sampleProducts]);

  // Focus input khi mở modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Handle input change with reset logic
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle close with reset
  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            ref={inputRef}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Results */}
        <ScrollArea className="max-h-96">
          <div className="p-4">
            {filteredProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => {
                      console.log("Chọn sản phẩm:", product);
                      handleClose();
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {product.image ? (
                        <Image
                          width={100}
                          height={100}
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">IMG</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-lg font-semibold">
                      ${product.price}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy sản phẩm {searchQuery}
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
