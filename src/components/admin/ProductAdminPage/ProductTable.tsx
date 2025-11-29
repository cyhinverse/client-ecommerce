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
          <span className="text-xs text-gray-400 line-through">
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
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8 rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-black"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={onCategoryFilterChange}
          >
            <SelectTrigger className="w-[180px] rounded-none border-gray-200 focus:ring-0 focus:border-black">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
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
            <SelectTrigger className="w-[180px] rounded-none border-gray-200 focus:ring-0 focus:border-black">
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
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
              <Button variant="outline" className="flex items-center gap-2 rounded-none border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Giá
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 rounded-none border-gray-200">
              <DropdownMenuLabel className="uppercase text-xs font-bold tracking-wider text-gray-500">Lọc theo giá</DropdownMenuLabel>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Giá thấp nhất"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    type="number"
                    className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-black"
                  />
                  <Input
                    placeholder="Giá cao nhất"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    type="number"
                    className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-black"
                  />
                </div>
                <Button onClick={handlePriceFilterApply} className="w-full rounded-none bg-black text-white hover:bg-gray-800">
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
            <SelectTrigger className="w-[180px] rounded-none border-gray-200 focus:ring-0 focus:border-black">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
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
          <SelectTrigger className="w-[180px] rounded-none border-gray-200 focus:ring-0 focus:border-black">
            <SelectValue placeholder="Hiển thị" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-gray-200">
            <SelectItem value="10">10 sản phẩm</SelectItem>
            <SelectItem value="20">20 sản phẩm</SelectItem>
            <SelectItem value="50">50 sản phẩm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-none border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-200">
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Hình ảnh</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Tên sản phẩm</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Danh mục</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Thương hiệu</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Giá</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Tồn kho</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Đã bán</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Trạng thái</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-gray-500">Ngày tạo</TableHead>
              <TableHead className="w-[80px] uppercase text-xs font-bold tracking-wider text-gray-500">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className="border-gray-100 hover:bg-gray-50">
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Package className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 font-normal">
                      {product.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{getCategoryName(product.category)}</TableCell>
                <TableCell className="text-gray-600">{product.brand || "Không có"}</TableCell>
                <TableCell>{getPriceDisplay(product.price)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-none border-gray-300 font-normal">{getStockCount(product)}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.soldCount || 0}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={product.isActive ? "default" : "secondary"} className={`rounded-none font-normal ${product.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {product.isActive ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                    {product.isNewArrival && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                        Mới
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100">
                        Nổi bật
                      </Badge>
                    )}
                    {product.onSale && (
                      <Badge variant="secondary" className="text-[10px] rounded-none bg-red-50 text-red-700 hover:bg-red-100 border-red-100">
                        Giảm giá
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-gray-200">
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
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
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
