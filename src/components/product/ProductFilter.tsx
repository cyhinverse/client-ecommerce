// ProductFilter.tsx - Taobao Style Filter Sidebar
"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, Check, ChevronDown, ChevronUp } from "lucide-react";
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
import { ProductFilters } from "@/types/product";

interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Màu sắc với tên tiếng Việt
const COLORS = [
  { name: "Đen", value: "black", hex: "#000000" },
  { name: "Trắng", value: "white", hex: "#FFFFFF" },
  { name: "Xám", value: "gray", hex: "#6B7280" },
  { name: "Xanh Navy", value: "navy", hex: "#1E3A8A" },
  { name: "Be", value: "beige", hex: "#E5E0D6" },
  { name: "Nâu", value: "brown", hex: "#92400E" },
  { name: "Xanh lá", value: "green", hex: "#065F46" },
  { name: "Xanh dương", value: "blue", hex: "#1E40AF" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp đến Cao", value: "price_asc" },
  { label: "Giá: Cao đến Thấp", value: "price_desc" },
  { label: "Tên: A đến Z", value: "name_asc" },
  { label: "Tên: Z đến A", value: "name_desc" },
  { label: "Đánh giá cao nhất", value: "rating_desc" },
];

export default function ProductFilter({
  filters,
  onFilterChange,
  onClearFilters,
  isMobileOpen = false,
  onMobileClose,
}: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);

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

  // FIX: Đảm bảo hàm xử lý màu hoạt động đúng
  const handleColorChange = (colorValue: string) => {
    const newColors = filters.colors.includes(colorValue)
      ? filters.colors.filter((c) => c !== colorValue)
      : [...filters.colors, colorValue];

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

  // local state for debouncing search input
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Sync internal search state when filters.search changes (e.g. on clear)
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  // Debounce search update
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, onFilterChange, filters.search]);

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    color: true,
    size: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filterContent = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#E53935]" />
          <h2 className="text-base font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-[#E53935] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden rounded h-7 w-7 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm trong danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rounded h-9 bg-gray-50 border-gray-200 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/20 text-sm"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-semibold text-gray-800 cursor-pointer">Khoảng giá</Label>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3 space-y-3">
            <div className="px-1">
              <Slider
                min={0}
                max={10000000}
                step={100000}
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
                className="my-3"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₫</span>
                <Input
                  type="text"
                  value={priceRange[0].toLocaleString("vi-VN")}
                  readOnly
                  className="pl-5 h-8 text-xs bg-gray-50 border-gray-200 rounded"
                />
              </div>
              <span className="text-gray-400 text-xs">-</span>
              <div className="flex-1 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₫</span>
                <Input
                  type="text"
                  value={priceRange[1].toLocaleString("vi-VN")}
                  readOnly
                  className="pl-5 h-8 text-xs bg-gray-50 border-gray-200 rounded"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePriceCommit}
              className="w-full h-8 text-xs bg-[#E53935]/5 border-[#E53935]/20 text-[#E53935] hover:bg-[#E53935]/10 rounded"
            >
              Áp dụng
            </Button>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-semibold text-gray-800 cursor-pointer">Đánh giá</Label>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  filters.rating.includes(rating)
                    ? "bg-[#E53935]/5 border border-[#E53935]/20"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <span key={i} className="text-gray-200 text-sm">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">trở lên</span>
                {filters.rating.includes(rating) && (
                  <Check className="h-3 w-3 text-[#E53935] ml-auto" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-semibold text-gray-800 cursor-pointer">Màu sắc</Label>
          {expandedSections.color ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.color && (
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorChange(color.value)}
                className={`
                  relative h-7 w-7 rounded border-2 transition-all duration-200 flex items-center justify-center
                  ${
                    filters.colors.includes(color.value)
                      ? "border-[#E53935] ring-1 ring-[#E53935]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {filters.colors.includes(color.value) && (
                  <Check
                    className={`h-3 w-3 ${
                      color.value === "white" || color.value === "beige"
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-semibold text-gray-800 cursor-pointer">Kích thước</Label>
          {expandedSections.size ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.size && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <Button
                key={size}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSizeChange(size)}
                className={`
                  h-7 px-3 text-xs rounded transition-all
                  ${
                    filters.sizes.includes(size)
                      ? "bg-[#E53935] text-white border-[#E53935] hover:bg-[#D32F2F]"
                      : "bg-white border-gray-200 text-gray-600 hover:border-[#E53935] hover:text-[#E53935]"
                  }
                `}
              >
                {size}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="border-t border-gray-100 pt-3">
        <Label className="text-sm font-semibold text-gray-800 block mb-2">Sắp xếp theo</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger className="rounded h-9 border-gray-200 bg-gray-50 focus:ring-[#E53935]/20 focus:border-[#E53935] text-sm">
            <SelectValue placeholder="Chọn cách sắp xếp" />
          </SelectTrigger>
          <SelectContent className="rounded border-gray-200 shadow-lg">
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm cursor-pointer"
              >
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
          className="w-full rounded h-9 border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium mt-2"
          onClick={onClearFilters}
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  // Mobile version
  if (isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />

        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 lg:hidden overflow-y-auto shadow-xl">
          <div className="p-4">{filterContent}</div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto bg-[#f7f7f7] rounded-lg border border-gray-100 p-4">
        {filterContent}
      </div>
    </div>
  );
}
