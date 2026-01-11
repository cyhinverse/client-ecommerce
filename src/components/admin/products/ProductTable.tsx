import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Category, Price } from "@/types/product";
import { Shop } from "@/types/shop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  Store,
} from "lucide-react";
import { Product } from "@/types/product";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import Image from "next/image";

interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onCategoryFilterChange: (category: string) => void;
  onBrandFilterChange: (brand: string) => void;
  onPriceFilterChange: (
    min: number | undefined,
    max: number | undefined
  ) => void;
  onStatusFilterChange: (isActive: boolean | null) => void;
  onShopFilterChange?: (shopId: string) => void;
  selectedCategory: string;
  selectedBrand: string;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  selectedStatus: boolean | null;
  selectedShop?: string;
  shops?: Shop[];
}

export function ProductsTable({
  products,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  onCategoryFilterChange,
  onBrandFilterChange,
  onPriceFilterChange,
  onStatusFilterChange,
  onShopFilterChange,
  selectedCategory,
  selectedBrand,
  selectedMinPrice,
  selectedMaxPrice,
  selectedStatus,
  selectedShop = "all",
  shops = [],
  isLoading = false,
}: ProductsTableProps) {
  const [localMinPrice, setLocalMinPrice] = useState(
    selectedMinPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    selectedMaxPrice?.toString() || ""
  );

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, searchTerm, onSearch]);

  const handlePriceFilterApply = () => {
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;
    onPriceFilterChange(min, max);
  };

  // Lấy danh sách categories không trùng lặp - ĐÃ SỬA
  const categories = products
    .map((p) => {
      if (!p.category) return null;
      return typeof p.category === "string"
        ? { id: p.category, name: p.category, slug: p.category }
        : {
            id: p.category._id,
            name: p.category.name,
            slug: p.category.slug,
          };
    })
    .filter(
      (category): category is { id: string; name: string; slug: string } =>
        !!category
    )
    .filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );

  const brands = Array.from(
    new Set(
      products.map((p) => p.brand).filter((brand): brand is string => !!brand)
    )
  );

  const getCategoryName = (category: string | Category | null): string => {
    if (!category) return "None";
    return typeof category === "string" ? category : category.name || "None";
  };

  const getShopInfo = (
    shop: string | Shop | undefined
  ): { name: string; logo?: string } => {
    if (!shop) return { name: "N/A" };
    if (typeof shop === "string") return { name: shop };
    return { name: shop.name || "N/A", logo: shop.logo };
  };

  const getPriceDisplay = (price: Price | null) => {
    if (!price) return "0₫";
    const currentPrice = price.currentPrice || 0;
    const discountPrice = price.discountPrice || 0;

    return (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {currentPrice.toLocaleString()}₫
        </span>
        {discountPrice > 0 && discountPrice !== currentPrice && (
          <span className="text-xs text-muted-foreground line-through">
            {discountPrice.toLocaleString()}₫
          </span>
        )}
      </div>
    );
  };

  const getStockCount = (product: Product) => {
    // New schema: variants with stock
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, v) => total + (v.stock || 0), 0);
    }
    // Fallback to stock field
    return product.stock || 0;
  };

  // Get main image from variants or legacy tierVariations
  const getMainImage = (product: Product): string | null => {
    // New schema: variants with images (primary source)
    if (product.variants?.[0]?.images?.[0]) {
      return product.variants[0].images[0];
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#f7f7f7] p-4 rounded-2xl">
        <div className="flex flex-1 items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-white focus-visible:ring-0 transition-all"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={onCategoryFilterChange}
          >
            <SelectTrigger className="w-[160px] rounded-xl border-0 bg-white focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-0">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Brand Filter */}
          <Select value={selectedBrand} onValueChange={onBrandFilterChange}>
            <SelectTrigger className="w-[140px] rounded-xl border-0 bg-white focus:ring-0">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-0">
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-0 bg-white hover:bg-white/80"
              >
                <Filter className="h-4 w-4" />
                Price
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 rounded-xl border-0">
              <DropdownMenuLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Filter by price
              </DropdownMenuLabel>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    type="number"
                    className="rounded-lg border-0 bg-[#f7f7f7]"
                  />
                  <Input
                    placeholder="Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    type="number"
                    className="rounded-lg border-0 bg-[#f7f7f7]"
                  />
                </div>
                <Button
                  onClick={handlePriceFilterApply}
                  className="w-full rounded-lg bg-[#E53935] text-white hover:bg-[#D32F2F]"
                >
                  Apply
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <Select
            value={selectedStatus === null ? "all" : selectedStatus.toString()}
            onValueChange={(value) => {
              if (value === "all") {
                onStatusFilterChange(null);
              } else {
                onStatusFilterChange(value === "true");
              }
            }}
          >
            <SelectTrigger className="w-[140px] rounded-xl border-0 bg-white focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-0">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Shop Filter */}
          {onShopFilterChange && shops.length > 0 && (
            <Select value={selectedShop} onValueChange={onShopFilterChange}>
              <SelectTrigger className="w-[160px] rounded-xl border-0 bg-white focus:ring-0">
                <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Shop" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0">
                <SelectItem value="all">All Shops</SelectItem>
                {shops.map((shop) => (
                  <SelectItem key={shop._id} value={shop._id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Page Size Filter */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[120px] rounded-xl border-0 bg-white focus:ring-0">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-0">
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f7f7f7]">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="w-[70px] uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">
                Image
              </TableHead>
              <TableHead className="w-[220px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Product Name
              </TableHead>
              <TableHead className="w-[140px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Shop
              </TableHead>
              <TableHead className="w-[120px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="w-[100px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Brand
              </TableHead>
              <TableHead className="w-[100px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Price
              </TableHead>
              <TableHead className="w-[80px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Stock
              </TableHead>
              <TableHead className="w-[80px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Sold
              </TableHead>
              <TableHead className="w-[90px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-[100px] uppercase text-xs font-bold tracking-wider text-muted-foreground">
                Created At
              </TableHead>
              <TableHead className="w-[50px] uppercase text-xs font-bold tracking-wider text-muted-foreground text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <SpinnerLoading />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-32 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product._id}
                  className={`border-0 hover:bg-[#f7f7f7]/50 transition-colors ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <TableCell className="pl-6">
                    {getMainImage(product) ? (
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#f7f7f7]">
                        <Image
                          src={getMainImage(product)!}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-[#f7f7f7] flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-[250px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="text-foreground truncate font-medium text-sm"
                          title={product.name}
                        >
                          {product.name}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {product.isNewArrival && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px] rounded-md bg-blue-50 text-blue-600 border-0"
                            >
                              New
                            </Badge>
                          )}
                          {product.isFeatured && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px] rounded-md bg-purple-50 text-purple-600 border-0"
                            >
                              Hot
                            </Badge>
                          )}
                          {product.onSale && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px] rounded-md bg-red-50 text-red-600 border-0"
                            >
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div
                        className="text-xs text-muted-foreground font-normal truncate mt-0.5"
                        title={product.slug}
                      >
                        {product.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[140px]">
                      {getShopInfo(product.shop).logo ? (
                        <div className="relative h-6 w-6 rounded-md overflow-hidden bg-[#f7f7f7] shrink-0">
                          <Image
                            src={getShopInfo(product.shop).logo!}
                            alt={getShopInfo(product.shop).name}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-md bg-[#f7f7f7] flex items-center justify-center shrink-0">
                          <Store className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className="text-sm text-muted-foreground truncate"
                        title={getShopInfo(product.shop).name}
                      >
                        {getShopInfo(product.shop).name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div
                      className="max-w-[140px] truncate"
                      title={getCategoryName(product.category)}
                    >
                      {getCategoryName(product.category)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div
                      className="max-w-[120px] truncate"
                      title={product.brand || "None"}
                    >
                      {product.brand || "None"}
                    </div>
                  </TableCell>
                  <TableCell>{getPriceDisplay(product.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-0 font-normal bg-[#f7f7f7]"
                    >
                      {getStockCount(product)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {product.soldCount || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={`rounded-lg font-medium px-2.5 py-0.5 shadow-none border-0 ${
                        product.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-[#f7f7f7]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-0 shadow-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => onView(product)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(product)}
                          className="cursor-pointer gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(product)}
                          className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10 gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
