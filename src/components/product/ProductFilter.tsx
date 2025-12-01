// ProductFilter.tsx - Fixed Color Filter
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
import { ProductFilters } from "@/types/product";


interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Đảm bảo màu sắc được định nghĩa đúng
const COLORS = [
  { name: "Black", value: "black", hex: "#000000" },
  { name: "White", value: "white", hex: "#FFFFFF" },
  { name: "Gray", value: "gray", hex: "#6B7280" },
  { name: "Navy", value: "navy", hex: "#1E3A8A" },
  { name: "Beige", value: "beige", hex: "#E5E0D6" },
  { name: "Brown", value: "brown", hex: "#92400E" },
  { name: "Green", value: "green", hex: "#065F46" },
  { name: "Blue", value: "blue", hex: "#1E40AF" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
  { label: "Highest Rated", value: "rating_desc" },
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

  // FIX: Đảm bảo hàm xử lý màu hoạt động đúng
  const handleColorChange = (colorValue: string) => {
    console.log("Color clicked:", colorValue); // Debug
    console.log("Current colors:", filters.colors); // Debug
    
    const newColors = filters.colors.includes(colorValue)
      ? filters.colors.filter((c) => c !== colorValue)
      : [...filters.colors, colorValue];
    
    console.log("New colors:", newColors); // Debug
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
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-light tracking-tight">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden hover:bg-muted rounded-none h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">SEARCH</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-8 rounded-none border-border focus:border-primary focus:ring-primary h-9 text-sm"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">PRICE RANGE</Label>
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
          <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">RATING</Label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating.includes(rating)}
                onCheckedChange={() => handleRatingChange(rating)}
                className="rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground flex-1"
              >
                <div className="flex">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-warning text-xs">★</span>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <span key={i} className="text-muted text-xs">★</span>
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">& above</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors - FIXED */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">COLORS</Label>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button" // FIX: Thêm type="button" để tránh submit form
              onClick={() => handleColorChange(color.value)}
              className={`
                relative h-8 w-8 rounded-none border transition-all
                ${
                  filters.colors.includes(color.value)
                    ? "border-primary scale-105 shadow-sm"
                    : "border-border hover:border-muted-foreground"
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {filters.colors.includes(color.value) && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary bg-opacity-20">
                  <div className={`
                    font-bold text-sm
                    ${color.value === "white" || color.value === "beige" ? "text-primary" : "text-primary-foreground"}
                  `}>
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        {/* Debug info - có thể xóa sau khi test */}
        {filters.colors.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Selected: {filters.colors.join(", ")}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">SIZES</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES.map((size) => (
            <Button
              key={size}
              type="button" // FIX: Thêm type="button"
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className={`
                font-medium rounded-none h-8 text-xs transition-all
                ${filters.sizes.includes(size) 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary" 
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }
              `}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground tracking-wide uppercase">SORT BY</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger className="rounded-none border-border focus:border-primary focus:ring-primary h-9 text-sm">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border">
            {SORT_OPTIONS.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="rounded-none focus:bg-muted text-sm"
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
          className="w-full rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground h-9 text-sm transition-all duration-300"
          onClick={onClearFilters}
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Clear All Filters
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />

        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 lg:hidden overflow-y-auto border-r border-border">
          <div className="p-4">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-20 h-fit max-h-[calc(100vh-100px)] overflow-y-auto p-4 border-r border-border">
        {filterContent}
      </div>
    </div>
  );
}