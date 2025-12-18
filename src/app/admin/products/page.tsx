"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { toast } from "sonner";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/features/product/productAction";
import { Product, AdminProductFilters } from "@/types/product";
import { ProductsHeader } from "@/components/admin/products/ProductHeader";
import { ProductsStats } from "@/components/admin/products/ProductStats";
import { ProductsTable } from "@/components/admin/products/ProductTable";
import { PaginationControls } from "@/components/common/Pagination";
import { CreateModelProduct } from "@/components/admin/products/CreateModelProduct";
import { UpdateModelProduct } from "@/components/admin/products/UpdateModelProduct";
import { ViewModelProduct } from "@/components/admin/products/ViewModelProduct";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const productState = useAppSelector((state) => state.product);

  const defaultFilters = useMemo(() => ({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    brand: "",
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

  // Correcting state access: 'all' instead of 'products'
  const products: Product[] = productState.all || []; 
  const pagination = productState.pagination;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedBrand = filters.brand as string || "";
  const selectedMinPrice = filters.minPrice as number | null;
  const selectedMaxPrice = filters.maxPrice as number | null;
  const selectedStatus = filters.isActive as boolean | null;

  useEffect(() => {
    // Construct params matching the getAllProducts expected input
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedMinPrice !== null) params.minPrice = selectedMinPrice;
    if (selectedMaxPrice !== null) params.maxPrice = selectedMaxPrice;
    if (selectedStatus !== null) params.isActive = selectedStatus;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(getAllProducts(params as any));
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

  const handleOpenCreateModal = () => setCreateModalOpen(true);

  const handleCreateProduct = async (productData: FormData) => {
    setIsCreating(true);
    try {
      await dispatch(createProduct(productData)).unwrap();
      const params = { page: currentPage, limit: pageSize };
      dispatch(getAllProducts(params));
      setCreateModalOpen(false);
      toast.success("Product created successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = async (id: string, productData: FormData) => {
    setIsUpdating(true);
    try {
      await dispatch(updateProduct({ productId: id, updateData: productData })).unwrap();
      const params = { page: currentPage, limit: pageSize };
      dispatch(getAllProducts(params));
      setUpdateModalOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      const params = { page: currentPage, limit: pageSize };
      dispatch(getAllProducts(params));
      toast.success("Product deleted successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
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
    setSelectedProduct(product);
    setViewModalOpen(false);
    setUpdateModalOpen(true);
  };

  const handleCloseModals = () => {
     setUpdateModalOpen(false);
     setViewModalOpen(false);
     setSelectedProduct(null);
  }

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


  return (
    <div className="space-y-8 p-1">
      <ProductsHeader onOpenCreate={handleOpenCreateModal} />

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
          selectedCategory={selectedCategory}
          selectedBrand={filters.brand as string || ""}
          selectedMinPrice={filters.minPrice as number | undefined}
          selectedMaxPrice={filters.maxPrice as number | undefined}
          selectedStatus={filters.isActive as boolean | null}
        />

        <div className="mt-6 flex justify-center">
          <PaginationControls
            pagination={pagination}
            onPageChange={(page) => updateFilter("page", page)}
            itemName="products"
          />
        </div>
      </div>

      <CreateModelProduct
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreate={handleCreateProduct}
        isLoading={isCreating}
      />

      <UpdateModelProduct
        open={updateModalOpen}
        onOpenChange={handleCloseModals}
        product={selectedProduct}
        onUpdate={(formData) => selectedProduct && handleUpdateProduct(selectedProduct._id, formData)}
        isLoading={isUpdating}
      />

      <ViewModelProduct
        open={viewModalOpen}
        onOpenChange={handleCloseModals}
        product={selectedProduct}
        onEdit={handleEditFromView}
      />
    </div>
  );
}
