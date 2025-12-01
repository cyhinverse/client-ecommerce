"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  deleteCategory,
  getAllCategories,
  updateCategory,
  creatCategory,
} from "@/features/category/categoryAction";
import { Category, PaginationData, CategoryFilters } from "@/types/category";
import { CategoriesHeader } from "@/components/admin/categories/CategoriesHeader";
import { CategoriesStats } from "@/components/admin/categories/CategoriesStats";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import { PaginationControls } from "@/components/admin/categories/PaginationContro";
import { CategoryTreeView } from "@/components/admin/categories/CategoryTreeView";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditCategoryModal } from "@/components/admin/categories/UpdateModel";
import { ViewCategoryModal } from "@/components/admin/categories/ViewModal";
import { CreateCategoryModal } from "@/components/admin/categories/CreateModel";
import { toast } from "sonner";
import { Params } from "@/types/product";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function CategoriesAdminPage() {
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector((state) => state.category);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } = useUrlFilters<CategoryFilters>({
    defaultFilters: {
      page: 1,
      limit: 10,
      search: '',
    },
    basePath: '/admin/categories',
  });

  // Extract filter values
  const currentPage = Number(filters.page);
  const pageSize = Number(filters.limit);
  const searchTerm = filters.search as string;

  const categories: Category[] = categoryState.categories || [];
  const pagination: PaginationData | null = categoryState.pagination;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch categories when filters change
  useEffect(() => {
    const params: Record<string, string | number> = { page: currentPage, limit: pageSize };
    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    } else {
      params.parentCategory = "null";
    }

    dispatch(getAllCategories(params));
  }, [dispatch, currentPage, pageSize, searchTerm]);


  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateCategory = async (categoryData: Partial<Category>) => {
    setIsCreating(true);
    try {
      await dispatch(creatCategory(categoryData as any)).unwrap();

      // Refresh list
      const params: Params = { page: currentPage, limit: pageSize };
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      dispatch(getAllCategories(params));

      setCreateModalOpen(false);
      toast.success("Tạo danh mục thành công");
    } catch {
      toast.error("Lỗi khi tạo danh mục. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleEditFromView = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
    setIsUpdating(false);
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    if (!selectedCategory) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateCategory({
          id: selectedCategory._id,
          ...categoryData,
        } as any)
      ).unwrap();

      // Refresh list
      const params: Params = { page: currentPage, limit: pageSize };
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      dispatch(getAllCategories(params));

      handleCloseEditModal();

      toast.success("Cập nhật danh mục thành công");
    } catch {
      toast.error("Cập nhật danh mục thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter handlers
  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  const handlePageSizeChange = (size: number) => {
    updateFilters({ limit: size, page: 1 });
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const getParentName = (category: Category) => {
    if (category.parentCategory && category.parentCategory.name) {
      return category.parentCategory.name;
    }
    return "-";
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter(
      (category) =>
        category.parentCategory && category.parentCategory._id === parentId
    );
  };

  const getProductCount = (category: Category) => {
    return category.productCount || 0;
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    dispatch(deleteCategory(category._id as string));
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  const totalCategories = pagination?.totalItems || categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const childCategories = categories.filter((cat) => cat.parentCategory).length;
  const totalProducts = categories.reduce(
    (total, cat) => total + (cat.productCount || 0),
    0
  );

  if (categoryState.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {categoryState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoriesHeader onAddCategory={handleOpenCreateModal} />

      <CategoriesStats
        totalCategories={totalCategories}
        activeCategories={activeCategories}
        childCategories={childCategories}
        totalProducts={totalProducts}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Quản lý tất cả danh mục sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            categories={categories}
            searchTerm={searchTerm}
            pageSize={pageSize}
            isLoading={categoryState.isLoading}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onView={handleViewCategory}
            getParentName={getParentName}
            getProductCount={getProductCount}
          />

          <CreateCategoryModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateCategory as any}
            categories={categories}
            isLoading={isCreating}
          />

          <ViewCategoryModal
            isOpen={viewModalOpen}
            onClose={handleCloseModals}
            onEdit={handleEditFromView}
            category={selectedCategory}
          />

          <EditCategoryModal
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveCategory}
            category={selectedCategory}
            isLoading={isUpdating}
          />

          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <CategoryTreeView
        categories={categories}
        getChildCategories={getChildCategories}
        getProductCount={getProductCount}
      />
    </div>
  );
}
