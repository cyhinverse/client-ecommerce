// ProductFilter.tsx - Fixed Color Filter
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
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

  const filterContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h2 className="text-xl font-semibold tracking-tight">Filter by</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden rounded-full h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-1 focus:ring-primary h-10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="px-1">
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
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
          <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Rating */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Rating</Label>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2.5">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating.includes(rating)}
                onCheckedChange={() => handleRatingChange(rating)}
                className="rounded-[4px] border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80 flex-1 hover:text-foreground transition-colors"
              >
                <div className="flex">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xs">★</span>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <span key={i} className="text-muted text-xs">★</span>
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">& Up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Colors - Apple Circles */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Color</Label>
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorChange(color.value)}
              className={`
                group relative h-9 w-9 rounded-full border transition-all duration-300 flex items-center justify-center
                ${
                  filters.colors.includes(color.value)
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent"
                    : "border-border/50 hover:border-border hover:scale-110"
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {filters.colors.includes(color.value) && (
                <Check className={`h-3.5 w-3.5 ${color.value === 'white' || color.value === 'beige' ? 'text-black' : 'text-white'}`} strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Sizes */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Size</Label>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              type="button"
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className={`
                font-medium rounded-lg h-9 text-xs transition-all
                ${filters.sizes.includes(size) 
                  ? "shadow-sm hover:opacity-90" 
                  : "border-border bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Sort */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger className="rounded-xl border-border/50 bg-muted/30 focus:ring-primary h-10 text-sm font-medium">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-lg p-1">
            {SORT_OPTIONS.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="rounded-lg text-sm cursor-pointer"
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
          className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive h-10 text-sm font-medium mt-4"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />

        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-[300px] bg-background z-50 lg:hidden overflow-y-auto border-r border-border shadow-2xl">
          <div className="p-6">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto px-4 py-2 custom-scrollbar">
        {filterContent}
      </div>
    </div>
  );
}