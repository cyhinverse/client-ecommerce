// components/admin/ProductAdminPage/ProductTable.tsx
import { useState } from "react";
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
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  pageSize: number;
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
  selectedCategory: string;
  selectedBrand: string;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  selectedStatus: boolean | null;
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
  selectedCategory,
  selectedBrand,
  selectedMinPrice,
  selectedMaxPrice,
  selectedStatus,
}: ProductsTableProps) {
  const [localMinPrice, setLocalMinPrice] = useState(
    selectedMinPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    selectedMaxPrice?.toString() || ""
  );

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

  const getCategoryName = (category: string | any | null): string => {
    if (!category) return "Không có";
    return typeof category === "string"
      ? category
      : category.name || "Không có";
  };

  const getPriceDisplay = (price: any) => {
    if (!price) return "0₫";
    const currentPrice = price.currentPrice || 0;
    const discountPrice = price.discountPrice || 0;

    return (
      <div className="flex flex-col">
        <span className="font-medium">{currentPrice.toLocaleString()}₫</span>
        {discountPrice > 0 && discountPrice !== currentPrice && (
          <span className="text-xs text-muted-foreground line-through">
            {discountPrice.toLocaleString()}₫
          </span>
        )}
      </div>
    );
  };

  const getStockCount = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce(
        (total, variant) => total + (variant.stock || 0),
        0
      );
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={onCategoryFilterChange}
          >
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Brand Filter */}
          <Select value={selectedBrand} onValueChange={onBrandFilterChange}>
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-none border-border hover:bg-muted">
                <Filter className="h-4 w-4" />
                Giá
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 rounded-none border-border">
              <DropdownMenuLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Lọc theo giá</DropdownMenuLabel>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Giá thấp nhất"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    type="number"
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                  <Input
                    placeholder="Giá cao nhất"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    type="number"
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>
                <Button onClick={handlePriceFilterApply} className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                  Áp dụng
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
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang hoạt động</SelectItem>
              <SelectItem value="false">Ngừng kinh doanh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Size Filter */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
            <SelectValue placeholder="Hiển thị" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border">
            <SelectItem value="10">10 sản phẩm</SelectItem>
            <SelectItem value="20">20 sản phẩm</SelectItem>
            <SelectItem value="50">50 sản phẩm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-none border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Hình ảnh</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Tên sản phẩm</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Danh mục</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Thương hiệu</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Giá</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Tồn kho</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Đã bán</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Ngày tạo</TableHead>
              <TableHead className="w-[80px] uppercase text-xs font-bold tracking-wider text-muted-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className="border-border hover:bg-muted/50">
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 object-cover border border-border"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted flex items-center justify-center border border-border">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-foreground">{product.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {product.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{getCategoryName(product.category)}</TableCell>
                <TableCell className="text-muted-foreground">{product.brand || "Không có"}</TableCell>
                <TableCell>{getPriceDisplay(product.price)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-none border-border font-normal">{getStockCount(product)}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{product.soldCount || 0}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={product.isActive ? "default" : "secondary"} className={`rounded-none font-normal ${product.isActive ? "bg-success/10 text-success hover:bg-success/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {product.isActive ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                    {product.isNewArrival && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-info/10 text-info hover:bg-info/20 border-info/20">
                        Mới
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        Nổi bật
                      </Badge>
                    )}
                    {product.onSale && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                        Giảm giá
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-border">
                      <DropdownMenuItem onClick={() => onView(product)} className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
