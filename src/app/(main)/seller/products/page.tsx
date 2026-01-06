"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Package, Plus, Search, Edit, Trash2, Eye, 
  Loader2, MoreHorizontal, Filter, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/hooks";
import api from "@/api/api";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: {
    originalPrice: number;
    currentPrice: number;
    discount?: number;
  };
  stock: number;
  isActive: boolean;
  category?: { name: string };
  createdAt: string;
}

export default function SellerProductsPage() {
  const router = useRouter();
  const { myShop } = useAppSelector((state) => state.shop);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (myShop?._id) {
      fetchProducts();
    }
  }, [myShop, pagination.page, searchTerm]);

  const fetchProducts = async () => {
    if (!myShop?._id) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        shop: myShop._id,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchTerm) params.append("search", searchTerm);

      const response = await api.get(`/products?${params}`);
      if (response.data?.data) {
        setProducts(response.data.data.products || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination?.total || 0,
          totalPages: response.data.data.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!myShop) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f7f7f7] rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <p className="text-sm text-gray-500">
              {pagination.total} sản phẩm trong shop của bạn
            </p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl h-11 px-5">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#f7f7f7] rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 rounded-xl border-0 bg-white"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl px-4 bg-white border-0">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Products */}
      <div className="bg-[#f7f7f7] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 text-sm mb-6">Bắt đầu thêm sản phẩm để bán hàng</p>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-white/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Giá bán
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kho hàng
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product._id} className={idx % 2 === 0 ? "bg-white" : "bg-white/50"}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f7f7f7] shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[280px]">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {product.category?.name || "Chưa phân loại"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        {formatPrice(product.price.currentPrice)}
                      </p>
                      {product.price.discount && product.price.discount > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(product.price.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        product.stock > 10 
                          ? "text-green-600" 
                          : product.stock > 0 
                            ? "text-yellow-600" 
                            : "text-red-500"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={product.isActive ? "default" : "secondary"}
                        className={`rounded-full px-3 ${
                          product.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isActive ? "Đang bán" : "Ẩn"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            onClick={() => router.push(`/product/${product.slug}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white/50">
                <p className="text-sm text-gray-500">
                  Hiển thị {products.length} / {pagination.total} sản phẩm
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="rounded-lg border-0 bg-white"
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="rounded-lg border-0 bg-white"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
