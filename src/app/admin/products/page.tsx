"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ProductsHeader } from "@/components/admin/ProductAdminPage/ProductHeader";
import { ProductsStats } from "@/components/admin/ProductAdminPage/ProductStats";
import { ProductsTable } from "@/components/admin/ProductAdminPage/ProductTable";
import { ProductPagination } from "@/components/admin/ProductAdminPage/ProductPagination";
import { CreateModelProduct } from "@/components/admin/ProductAdminPage/CreateModelProduct";
import { UpdateModelProduct } from "@/components/admin/ProductAdminPage/UpdateModelProduct";
import { ViewModelProduct } from "@/components/admin/ProductAdminPage/ViewModelProduct";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "@/features/product/productAction";
import { Product } from "@/types/product";

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  // SỬA: Lấy đúng state từ slice mới
  const { all: products, pagination, isLoading, error } = useAppSelector((state) => state.product);

  // Lấy params từ URL với giá trị mặc định hợp lệ
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const urlMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const urlIsActive = searchParams.get("isActive");

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number | undefined>(
    urlMinPrice
  );
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(
    urlMaxPrice
  );
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(
    urlIsActive === "true" ? true : urlIsActive === "false" ? false : null
  );

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
  // Hàm fetch products với params hợp lệ
  const fetchProducts = useCallback(() => {
    const params: Params = {
      page: currentPage,
      limit: pageSize,
    };

    // Chỉ thêm các param filter nếu có giá trị hợp lệ
    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      params.category = selectedCategory.trim();
    }
    if (selectedBrand && selectedBrand.trim() !== "") {
      params.brand = selectedBrand.trim();
    }
    if (selectedMinPrice !== undefined) {
      params.minPrice = selectedMinPrice;
    }
    if (selectedMaxPrice !== undefined) {
      params.maxPrice = selectedMaxPrice;
    }
    if (selectedStatus !== null) {
      params.isActive = selectedStatus;
    }

    // Lọc bỏ các param không hợp lệ trước khi gửi API
    const filteredParams = filterValidParams(params);
    console.log("Fetching products with params:", filteredParams);

    dispatch(getAllProducts(filteredParams as Params ));
  }, [
    currentPage,
    pageSize,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedMinPrice,
    selectedMaxPrice,
    selectedStatus,
    dispatch
  ]);

  const updateURL = (
    page: number,
    limit: number,
    search: string,
    category: string,
    brand: string,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    isActive: boolean | null
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    // Chỉ thêm các param có giá trị hợp lệ
    if (search && search.trim() !== "") {
      params.set("search", search);
    }
    if (category && category.trim() !== "") {
      params.set("category", category);
    }
    if (brand && brand.trim() !== "") {
      params.set("brand", brand);
    }
    if (minPrice !== undefined) {
      params.set("minPrice", minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params.set("maxPrice", maxPrice.toString());
    }
    if (isActive !== null) {
      params.set("isActive", isActive.toString());
    }

    const url = `/admin/products?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  // Fetch products khi component mount và khi filter thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Đồng bộ state với URL params
  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setSelectedMinPrice(urlMinPrice);
    setSelectedMaxPrice(urlMaxPrice);
    setSelectedStatus(
      urlIsActive === "true" ? true : urlIsActive === "false" ? false : null
    );
  }, [
    urlPage,
    urlLimit,
    urlSearch,
    urlCategory,
    urlBrand,
    urlMinPrice,
    urlMaxPrice,
    urlIsActive,
  ]);

  // SỬA: Thêm loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Đang tải...</div>
      </div>
    );
  }

  // Event handlers
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateProduct = async (formData: FormData) => {
    setIsCreating(true);
    try {
      await dispatch(createProduct(formData)).unwrap();
      fetchProducts();
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
      fetchProducts();
      handleCloseEditModal();
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại." + error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(
      page,
      pageSize,
      searchTerm,
      selectedCategory,
      selectedBrand,
      selectedMinPrice,
      selectedMaxPrice,
      selectedStatus
    );
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(
      1,
      size,
      searchTerm,
      selectedCategory,
      selectedBrand,
      selectedMinPrice,
      selectedMaxPrice,
      selectedStatus
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(
      1,
      pageSize,
      value,
      selectedCategory,
      selectedBrand,
      selectedMinPrice,
      selectedMaxPrice,
      selectedStatus
    );
  };

  const handleCategoryFilterChange = (category: string) => {
    const newCategory = category === "all" ? "" : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    updateURL(
      1,
      pageSize,
      searchTerm,
      newCategory,
      selectedBrand,
      selectedMinPrice,
      selectedMaxPrice,
      selectedStatus
    );
  };

  const handleBrandFilterChange = (brand: string) => {
    const newBrand = brand === "all" ? "" : brand;
    setSelectedBrand(newBrand);
    setCurrentPage(1);
    updateURL(
      1,
      pageSize,
      searchTerm,
      selectedCategory,
      newBrand,
      selectedMinPrice,
      selectedMaxPrice,
      selectedStatus
    );
  };

  const handlePriceFilterChange = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setSelectedMinPrice(min);
    setSelectedMaxPrice(max);
    setCurrentPage(1);
    updateURL(
      1,
      pageSize,
      searchTerm,
      selectedCategory,
      selectedBrand,
      min,
      max,
      selectedStatus
    );
  };

  const handleStatusFilterChange = (isActive: boolean | null) => {
    setSelectedStatus(isActive);
    setCurrentPage(1);
    updateURL(
      1,
      pageSize,
      searchTerm,
      selectedCategory,
      selectedBrand,
      selectedMinPrice,
      selectedMaxPrice,
      isActive
    );
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
      fetchProducts();
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
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
}