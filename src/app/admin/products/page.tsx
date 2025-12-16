"use client";
import { useEffect, useState } from "react";
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
  deleteVariantByVariantId,
} from "@/features/product/productAction";
import { Product, AdminProductFilters } from "@/types/product";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const {
    all: products,
    pagination,
    isLoading,
    error,
  } = useAppSelector((state) => state.product);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } =
    useUrlFilters<AdminProductFilters>({
      defaultFilters: {
        page: 1,
        limit: 10,
        search: "",
        category: "",
        brand: "",
        minPrice: null,
        maxPrice: null,
        isActive: null,
      },
      basePath: "/admin/products",
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

  type Params = {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
  };

  useEffect(() => {
    const params: Params = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedMinPrice !== undefined && selectedMinPrice !== null)
      params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== undefined && selectedMaxPrice !== null)
      params.maxPrice = selectedMaxPrice;
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
    selectedStatus,
  ]);

  const refreshData = () => {
    const params: Params = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedMinPrice !== undefined && selectedMinPrice !== null)
      params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== undefined && selectedMaxPrice !== null)
      params.maxPrice = selectedMaxPrice;
    if (selectedStatus !== null) params.isActive = selectedStatus;

    dispatch(getAllProducts(params));
  };

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
    updateFilter("page", page);
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
      await dispatch(deleteProduct(product._id)).unwrap();

      toast.success("Xóa sản phẩm thành công");

      refreshData();
    } catch (error) {
      console.error("Delete product error:", error);

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
  const activeProducts = productList.filter(
    (product) => product.isActive
  ).length;
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


  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Lỗi: {error}</div>
      </div>
    );
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!selectedProduct) return;
    try {
      await dispatch(
        deleteVariantByVariantId({
          productId: selectedProduct._id,
          variantId,
        })
      ).unwrap();
      refreshData();
      toast.success("Xóa biến thể thành công");
    } catch (error) {
      const msg = typeof error === "string" ? error : "Xóa biến thể thất bại";
      toast.error(msg);
      throw error; // Re-throw to prevent UI removal in child
    }
  };

  return (
    <div className="space-y-6 no-scrollbar">
      <ProductsHeader onOpenCreate={handleOpenCreateModal} />

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
            products={productList} 
            searchTerm={searchTerm}
            pageSize={pageSize}
            isLoading={isLoading}
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
            onDeleteVariant={handleDeleteVariant}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
