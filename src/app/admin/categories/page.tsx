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
import { PaginationControls } from "@/components/common/Pagination";
import { CategoryTreeView } from "@/components/admin/categories/CategoryTreeView";
import { EditCategoryModal } from "@/components/admin/categories/UpdateModel";
import { ViewCategoryModal } from "@/components/admin/categories/ViewModal";
import { CreateCategoryModal } from "@/components/admin/categories/CreateModel";
import { toast } from "sonner";
import { Params } from "@/types/product";

export default function CategoriesAdminPage() {
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector((state) => state.category);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } =
    useUrlFilters<CategoryFilters>({
      defaultFilters: {
        page: 1,
        limit: 10,
        search: "",
      },
      basePath: "/admin/categories",
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
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: pageSize,
    };
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

  const handleCreateCategory = async (categoryData: {
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    parentCategory: string;
    images: string[];
  }) => {
    setIsCreating(true);
    try {
      await dispatch(
        creatCategory({
          ...categoryData,
          parentCategory:
            categoryData.parentCategory === ""
              ? undefined
              : categoryData.parentCategory,
        })
      ).unwrap();

      // Refresh list
      const params: Params = { page: currentPage, limit: pageSize };
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      dispatch(getAllCategories(params));

      setCreateModalOpen(false);
      toast.success("Category created successfully");
    } catch {
      toast.error("Error creating category. Please try again.");
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
        } as {
          id: string;
          name: string;
          slug: string;
          description?: string;
          isActive: boolean;
          isFeatured?: boolean;
        })
      ).unwrap();

      // Refresh list
      const params: Params = { page: currentPage, limit: pageSize };
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      dispatch(getAllCategories(params));

      handleCloseEditModal();

      toast.success("Category updated successfully");
    } catch {
      toast.error("Failed to update category. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter handlers
  const handlePageChange = (page: number) => {
    updateFilter("page", page);
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
        <div className="text-red-500">Error: {categoryState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <CategoriesHeader onAddCategory={handleOpenCreateModal} />

      {/* Stats Section */}
      <CategoriesStats
        totalCategories={totalCategories}
        activeCategories={activeCategories}
        childCategories={childCategories}
        totalProducts={totalProducts}
      />

      {/* Main Content Area */}
      <div className="space-y-6">
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

        <div className="mt-6">
          <PaginationControls
             pagination={pagination}
             onPageChange={handlePageChange}
             itemName="categories"
          />
        </div>

        <CreateCategoryModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateCategory}
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
      </div>

      {/* Tree View Section */}
      <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl">
         <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Structure View</h2>
            <p className="text-sm text-muted-foreground mt-1">Hierarchical view of categories</p>
         </div>
         <CategoryTreeView
          categories={categories}
          getChildCategories={getChildCategories}
          getProductCount={getProductCount}
        />
      </div>
    </div>
  );
}
