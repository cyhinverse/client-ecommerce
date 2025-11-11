"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "@/features/category/categoryAction";
import { Category, PaginationData } from "@/types/category";
import { CategoriesHeader } from "@/components/admin/CategoriesAdminPage/CategoriesHeader";
import { CategoriesStats } from "@/components/admin/CategoriesAdminPage/CategoriesStats";
import { CategoriesTable } from "@/components/admin/CategoriesAdminPage/CategoriesTable";
import { PaginationControls } from "@/components/admin/CategoriesAdminPage/PaginationContro";
import { CategoryTreeView } from "@/components/admin/CategoriesAdminPage/CategoryTreeView";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditCategoryModal } from "@/components/admin/CategoriesAdminPage/UpdateModel";
import { ViewCategoryModal } from "@/components/admin/CategoriesAdminPage/ViewModal";

export default function CategoriesAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector((state) => state.category);

  // Lấy params từ URL
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");
  const urlSearch = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  const categories: Category[] = categoryState.categories || [];
  const pagination: PaginationData | null = categoryState.pagination;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleEditFromView = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
    setIsUpdating(false);
  };

  // Hàm lưu thay đổi
  const handleSaveCategory = async (categoryData: any) => {
    if (!selectedCategory) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateCategory({
          id: selectedCategory._id,
          ...categoryData,
        })
      ).unwrap();

      // Refresh danh sách sau khi update
      dispatch(
        getAllCategories({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        })
      );

      handleCloseEditModal();

      // Có thể thêm toast notification ở đây
      console.log("Cập nhật danh mục thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      // Có thể thêm error handling ở đây
    } finally {
      setIsUpdating(false);
    }
  };

  // Hàm cập nhật URL
  const updateURL = (page: number, limit: number, search: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search && search.trim() !== "") {
      params.set("search", search);
    }

    router.push(`/admin/categories?${params.toString()}`, { scroll: false });
  };

  // Fetch categories khi URL params thay đổi
  useEffect(() => {
    const params: any = { page: currentPage, limit: pageSize };
    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }

    dispatch(getAllCategories(params));
  }, [dispatch, currentPage, pageSize, searchTerm]);

  // Đồng bộ state với URL params khi trang load hoặc URL thay đổi
  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
  }, [urlPage, urlLimit, urlSearch]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, searchTerm);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, searchTerm);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, pageSize, value);
  };

  const handleAddCategory = () => {
    console.log("Add category clicked");
    // TODO: Implement add category modal
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    dispatch(deleteCategory(category._id));
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  // Tính toán thống kê
  const rootCategories = categories.filter(
    (category) => !category.parentCategory
  );
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
      <CategoriesHeader onAddCategory={handleAddCategory} />

      <CategoriesStats
        totalCategories={totalCategories}
        activeCategories={activeCategories}
        childCategories={childCategories}
        totalProducts={totalProducts}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>Quản lý tất cả danh mục sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            categories={categories}
            searchTerm={searchTerm}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onView={handleViewCategory}
            getParentName={getParentName}
            getProductCount={getProductCount}
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
