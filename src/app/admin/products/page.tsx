"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ProductsHeader } from "@/components/admin/products/ProductHeader";
import { ProductsStats } from "@/components/admin/products/ProductStats";
import { ProductsTable } from "@/components/admin/products/ProductTable";
import { ProductPagination } from "@/components/admin/products/ProductPagination";
import { CreateModelProduct } from "@/components/admin/products/CreateModelProduct";
import { UpdateModelProduct } from "@/components/admin/products/UpdateModelProduct";
import { ViewModelProduct } from "@/components/admin/products/ViewModelProduct";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "@/features/product/productAction";
import { Product, AdminProductFilters } from "@/types/product";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  // SỬA: Lấy đúng state từ slice mới
  const { all: products, pagination, isLoading, error } = useAppSelector((state) => state.product);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } = useUrlFilters<AdminProductFilters>({
    defaultFilters: {
      page: 1,
      limit: 10,
      search: '',
      category: '',
      brand: '',
      minPrice: null,
      maxPrice: null,
      isActive: null,
    },
    basePath: '/admin/products',
  });

  // Extract filter values
  const currentPage = Number(filters.page);
  const pageSize = Number(filters.limit);
  const searchTerm = filters.search as string;
  const selectedCategory = filters.category as string;
  const selectedBrand = filters.brand as string;
  const selectedMinPrice = filters.minPrice as number | undefined;
  const selectedMaxPrice = filters.maxPrice as number | undefined;
  const selectedStatus = filters.isActive as boolean | null;

  // SỬA: Đảm bảo products luôn là array (đã có từ selector)
  const productList: Product[] = Array.isArray(products) ? products : [];

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm lọc bỏ các param không hợp lệ
  const filterValidParams = (params: Record<string, any>) => {
    const filtered: Record<string, any> = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      // Chỉ giữ lại các giá trị hợp lệ
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "undefined"
      ) {
        filtered[key] = value;
      }
    });
    return filtered;
  };

  type Params = {
    page: number,
    limit: number,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    isActive?: boolean
  }


  // Fetch products when filters change
  useEffect(() => {
    const params: Params = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedMinPrice !== undefined && selectedMinPrice !== null) params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== undefined && selectedMaxPrice !== null) params.maxPrice = selectedMaxPrice;
    if (selectedStatus !== null) params.isActive = selectedStatus;

    dispatch(getAllProducts(params));
  }, [
    dispatch, 
    currentPage, 
    pageSize, 
    searchTerm, 
    selectedCategory, 
    selectedBrand, 
    selectedMinPrice, 
    selectedMaxPrice, 
    selectedStatus
  ]);

  const refreshData = () => {
    const params: Params = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedMinPrice !== undefined && selectedMinPrice !== null) params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== undefined && selectedMaxPrice !== null) params.maxPrice = selectedMaxPrice;
    if (selectedStatus !== null) params.isActive = selectedStatus;

    dispatch(getAllProducts(params));
  };

  // SỬA: Thêm loading state
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div>Đang tải...</div>
  //     </div>
  //   );
  // }

  // Event handlers
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateProduct = async (formData: FormData) => {
    setIsCreating(true);
    try {
      await dispatch(createProduct(formData)).unwrap();
      refreshData();
      setCreateModalOpen(false);
      toast.success("Tạo sản phẩm thành công");
    } catch (error) {
      toast.error("Lỗi khi tạo sản phẩm. Vui lòng thử lại." + error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleEditFromView = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(false);
    setUpdateModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setUpdateModalOpen(false);
    setSelectedProduct(null);
    setIsUpdating(false);
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateProduct({
          productId: selectedProduct._id,
          updateData: formData,
        })
      ).unwrap();
      refreshData();
      handleCloseEditModal();
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại." + error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  const handlePageSizeChange = (size: number) => {
    updateFilters({ limit: size, page: 1 });
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleCategoryFilterChange = (category: string) => {
    const newCategory = category === "all" ? "" : category;
    updateFilters({ category: newCategory, page: 1 });
  };

  const handleBrandFilterChange = (brand: string) => {
    const newBrand = brand === "all" ? "" : brand;
    updateFilters({ brand: newBrand, page: 1 });
  };

  const handlePriceFilterChange = (
    min: number | undefined,
    max: number | undefined
  ) => {
    updateFilters({ minPrice: min, maxPrice: max, page: 1 });
  };

  const handleStatusFilterChange = (isActive: boolean | null) => {
    updateFilters({ isActive: isActive, page: 1 });
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      // Sử dụng unwrap() để throw error nếu rejected
      await dispatch(deleteProduct(product._id)).unwrap();

      toast.success("Xóa sản phẩm thành công");

      // Refresh data sau khi xóa thành công
      refreshData();
    } catch (error) {
      console.error("Delete product error:", error);

      // Kiểm tra nếu error thực sự là string message
      if (error && typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  // Tính toán thống kê - SỬA: sử dụng productList thay vì products
  const totalProducts = pagination?.totalItems || productList.length;
  const activeProducts = productList.filter((product) => product.isActive).length;
  const productsOnSale = productList.filter((product) => product.onSale).length;

  // Lấy tổng số danh mục unique
  const categories = Array.from(
    new Set(
      productList
        .map((p) =>
          typeof p.category === "string" ? p.category : p.category?.name
        )
        .filter(Boolean)
    )
  );
  const totalCategories = categories.length;

  // SỬA: Kiểm tra error từ state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader onOpenCreate={handleOpenCreateModal} />

      {isLoading ? (
        <SpinnerLoading />
      ) : (
        <>
          <ProductsStats
            totalProducts={totalProducts}
            activeProducts={activeProducts}
            productsOnSale={productsOnSale}
            totalCategories={totalCategories}
          />

          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>
                Quản lý tất cả sản phẩm trong cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable
                products={productList} // SỬA: sử dụng productList
                searchTerm={searchTerm}
                pageSize={pageSize}
                onSearch={handleSearch}
                onPageSizeChange={handlePageSizeChange}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
                onCategoryFilterChange={handleCategoryFilterChange}
                onBrandFilterChange={handleBrandFilterChange}
                onPriceFilterChange={handlePriceFilterChange}
                onStatusFilterChange={handleStatusFilterChange}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                selectedMinPrice={selectedMinPrice}
                selectedMaxPrice={selectedMaxPrice}
                selectedStatus={selectedStatus}
              />

              <ProductPagination
                currentPage={currentPage}
                totalPages={pagination?.totalPages || 1}
                totalItems={pagination?.totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />

              <CreateModelProduct
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onCreate={handleCreateProduct}
                isLoading={isCreating}
              />

              <ViewModelProduct
                open={viewModalOpen}
                onOpenChange={handleCloseModals}
                product={selectedProduct}
                onEdit={handleEditFromView}
              />

              <UpdateModelProduct
                open={updateModalOpen}
                onOpenChange={handleCloseEditModal}
                product={selectedProduct}
                onUpdate={handleUpdateProduct}
                isLoading={isUpdating}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}