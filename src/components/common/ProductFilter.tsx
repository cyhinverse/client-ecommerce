// ProductFilter.tsx - Main Filter Sidebar Component
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export interface ProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const COLORS = [
  { name: "Đen", value: "đen", hex: "#000000" },
  { name: "Trắng", value: "trắng", hex: "#FFFFFF" },
  { name: "Xám", value: "xám", hex: "#808080" },
  { name: "Đỏ", value: "đỏ", hex: "#EF4444" },
  { name: "Xanh dương", value: "xanh dương", hex: "#3B82F6" },
  { name: "Xanh lá", value: "xanh lá", hex: "#10B981" },
  { name: "Vàng", value: "vàng", hex: "#F59E0B" },
  { name: "Hồng", value: "hồng", hex: "#EC4899" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp → Cao", value: "price_asc" },
  { label: "Giá: Cao → Thấp", value: "price_desc" },
  { label: "Tên: A → Z", value: "name_asc" },
  { label: "Tên: Z → A", value: "name_desc" },
  { label: "Đánh giá cao nhất", value: "rating_desc" },
];

export default function ProductFilter({
  filters,
  onFilterChange,
  onClearFilters,
  isMobileOpen = false,
  onMobileClose,
}: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = filters.rating.includes(rating)
      ? filters.rating.filter((r) => r !== rating)
      : [...filters.rating, rating];
    onFilterChange({ rating: newRatings });
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ colors: newColors });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ sizes: newSizes });
  };

  const activeFiltersCount = 
    filters.rating.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.search ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000000 ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tìm kiếm</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm sản phẩm..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Khoảng giá</Label>
        <div className="px-2">
          <Slider
            min={0}
            max={10000000}
            step={100000}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="my-4"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {priceRange[0].toLocaleString("vi-VN")}đ
          </span>
          <span className="text-muted-foreground">
            {priceRange[1].toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Đánh giá</Label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating.includes(rating)}
                onCheckedChange={() => handleRatingChange(rating)}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer text-sm"
              >
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
                <span className="text-muted-foreground ml-1">trở lên</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Màu sắc</Label>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`
                relative h-10 w-10 rounded-full border-2 transition-all
                ${
                  filters.colors.includes(color.value)
                    ? "border-black scale-110 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {filters.colors.includes(color.value) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`
                    font-bold
                    ${color.value === "trắng" || color.value === "vàng" ? "text-black" : "text-white"}
                  `}>
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Kích thước</Label>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className="font-medium"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sắp xếp theo</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn cách sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  // Desktop version - always render, CSS handles visibility
  // Mobile version - only render when open
  if (isMobileOpen) {
    // Mobile sidebar overlay
    return (
      <AnimatePresence>
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              {filterContent}
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    );
  }

  // Desktop version
  return (
    <Card className="hidden lg:block p-6 sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
      {filterContent}
    </Card>
  );
}
