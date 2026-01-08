"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { toast } from "sonner";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "@/features/product/productAction";
import { getAllShops } from "@/features/shop/shopAction";
import { Product, AdminProductFilters, Shop } from "@/types/product";
import { ProductsHeader } from "@/components/admin/products/ProductHeader";
import { ProductsStats } from "@/components/admin/products/ProductStats";
import { ProductsTable } from "@/components/admin/products/ProductTable";
import { PaginationControls } from "@/components/common/Pagination";
import { UpdateModelProduct } from "@/components/product/forms/UpdateModelProduct";
import { ViewModelProduct } from "@/components/product/forms/ViewModelProduct";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const productState = useAppSelector((state) => state.product);
  const shopState = useAppSelector((state) => state.shop);

  // Get shops list for filter
  const shops: Shop[] = shopState.shops || [];

  const defaultFilters = useMemo(() => ({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    brand: "",
    shop: "",
    minPrice: null,
    maxPrice: null,
    isActive: null,
  }), []);

  const { filters, updateFilter, updateFilters } = useUrlFilters<AdminProductFilters>({
    defaultFilters,
    basePath: "/admin/products",
  });

  const currentPage = Number(filters.page) || 1;
  const pageSize = Number(filters.limit) || 10;

  const searchTerm = filters.search as string || "";
  const selectedCategory = filters.category as string || "";

  const products: Product[] = productState.all || []; 
  const pagination = productState.pagination;

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedBrand = filters.brand as string || "";
  const selectedShop = filters.shop as string || "";
  const selectedMinPrice = filters.minPrice as number | null;
  const selectedMaxPrice = filters.maxPrice as number | null;
  const selectedStatus = filters.isActive as boolean | null;

  const fetchProducts = useCallback(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedShop) params.shop = selectedShop;
    if (selectedMinPrice !== null) params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== null) params.maxPrice = selectedMaxPrice;
    if (selectedStatus !== null) params.isActive = selectedStatus;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(getAllProducts(params as any));
  }, [dispatch, currentPage, pageSize, searchTerm, selectedCategory, selectedBrand, selectedShop, selectedMinPrice, selectedMaxPrice, selectedStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch shops for filter dropdown
  useEffect(() => {
    dispatch(getAllShops());
  }, [dispatch]);

  const handleUpdateProduct = async (id: string, productData: FormData) => {
    setIsUpdating(true);
    try {
      await dispatch(updateProduct({ productId: id, updateData: productData })).unwrap();
      fetchProducts();
      setUpdateModalOpen(false);
      setSelectedProduct(null);
      toast.success("Cập nhật sản phẩm thành công");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật sản phẩm");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      fetchProducts();
      toast.success("Xóa sản phẩm thành công");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa sản phẩm");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEditFromView = (product: Product) => {
    setViewModalOpen(false);
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = (open: boolean) => {
    setUpdateModalOpen(open);
    if (!open) setSelectedProduct(null);
  };

  const handleCloseViewModal = (open: boolean) => {
    setViewModalOpen(open);
    if (!open) setSelectedProduct(null);
  };

  const totalProducts = pagination?.totalItems || 0;
  // Calculate stats based on current loaded products (or better, fetch from stats API if available)
  const activeProducts = products.filter(p => p.isActive).length; 
  // Note: These client-side stats are only for the current page. ideally we want backend stats.
  // Passing these mostly as placeholders/for immediate visual feedback.
  
  // Calculate total categories and on sale products for the stats component
  const totalCategories = new Set(products.map(p => typeof p.category === 'object' ? p.category?._id : p.category)).size;
  const productsOnSale = products.filter(p => p.onSale).length;


  // Handlers for table filters
  const handleCategoryFilterChange = (category: string) => {
    updateFilter("category", category === 'all' ? '' : category);
  };

  const handleBrandFilterChange = (brand: string) => {
     updateFilters({ brand: brand === 'all' ? '' : brand, page: 1 });
  };

  const handlePriceFilterChange = (min: number | undefined, max: number | undefined) => {
      updateFilters({ minPrice: min || null, maxPrice: max || null, page: 1 });
  };
  
  const handleStatusFilterChange = (status: boolean | null) => {
      updateFilters({ isActive: status, page: 1 });
  };

  const handleShopFilterChange = (shop: string) => {
      updateFilters({ shop: shop === 'all' ? '' : shop, page: 1 });
  };


  return (
    <div className="space-y-8 p-1">
      <ProductsHeader onRefresh={fetchProducts} />

      <ProductsStats 
         totalProducts={totalProducts}
         activeProducts={activeProducts}
         productsOnSale={productsOnSale}
         totalCategories={totalCategories}
      />

      <div className="space-y-6">
        <ProductsTable
          products={products}
          isLoading={productState.isLoading}
          searchTerm={searchTerm}
          pageSize={pageSize}
          onSearch={(val) => updateFilters({ search: val, page: 1 })}
          onPageSizeChange={(size) => updateFilters({ limit: size, page: 1 })}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
          onCategoryFilterChange={handleCategoryFilterChange}
          onBrandFilterChange={handleBrandFilterChange}
          onPriceFilterChange={handlePriceFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onShopFilterChange={handleShopFilterChange}
          selectedCategory={selectedCategory}
          selectedBrand={filters.brand as string || ""}
          selectedShop={selectedShop || "all"}
          selectedMinPrice={filters.minPrice as number | undefined}
          selectedMaxPrice={filters.maxPrice as number | undefined}
          selectedStatus={filters.isActive as boolean | null}
          shops={shops}
        />

        <div className="mt-6 flex justify-center">
          <PaginationControls
            pagination={pagination}
            onPageChange={(page) => updateFilter("page", page)}
            itemName="sản phẩm"
          />
        </div>
      </div>

      <UpdateModelProduct
        open={updateModalOpen}
        onOpenChange={handleCloseUpdateModal}
        product={selectedProduct}
        onUpdate={(formData) => selectedProduct && handleUpdateProduct(selectedProduct._id, formData)}
        isLoading={isUpdating}
      />

      <ViewModelProduct
        open={viewModalOpen}
        onOpenChange={handleCloseViewModal}
        product={selectedProduct}
        onEdit={handleEditFromView}
      />
    </div>
  );
}
