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
import {
  getAllDiscounts,
  deleteDiscount,
  updateDiscount,
  createDiscount,
  getDiscountStatistics,
} from "@/features/discount/discountAction";
import { Discount } from "@/types/discount";
import { DiscountsHeader } from "@/components/admin/DiscountAdminPage/DiscountHeader";
import { DiscountsStats } from "@/components/admin/DiscountAdminPage/DiscountStats";
import { DiscountsTable } from "@/components/admin/DiscountAdminPage/DiscountTable";
import { DiscountPagination } from "@/components/admin/DiscountAdminPage/DiscountPaginationControl";
import { CreateModelDiscount } from "@/components/admin/DiscountAdminPage/CreateModelDiscount";
import { ViewModelDiscount } from "@/components/admin/DiscountAdminPage/ViewModelDiscount";
import { UpdateModelDiscount } from "@/components/admin/DiscountAdminPage/UpdateModelDiscount";

export default function AdminDiscountsPage() {
  const dispatch = useAppDispatch();
  const discountState = useAppSelector((state) => state.discount);

  // Define filter interface
  interface DiscountFilters {
    page: number;
    limit: number;
    search: string;
    discountType: string;
    isActive: boolean | null;
    [key: string]: string | number | boolean | null;
  }

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } = useUrlFilters<DiscountFilters>({
    defaultFilters: {
      page: 1,
      limit: 10,
      search: '',
      discountType: '',
      isActive: null,
    },
    basePath: '/admin/discounts',
  });

  // Extract filter values
  const currentPage = Number(filters.page);
  const pageSize = Number(filters.limit);
  const searchTerm = filters.search as string;
  const selectedDiscountType = filters.discountType as string;
  const selectedIsActive = filters.isActive as boolean | null;

  const discounts: Discount[] = discountState?.discounts || [];
  const pagination = discountState?.pagination;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch discounts when filters change
  useEffect(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }
    if (selectedDiscountType && selectedDiscountType.trim() !== "") {
      params.discountType = selectedDiscountType.trim();
    }
    if (selectedIsActive !== null) {
      params.isActive = selectedIsActive;
    }

    dispatch(getAllDiscounts(params));
    dispatch(getDiscountStatistics());
  }, [dispatch, currentPage, pageSize, searchTerm, selectedDiscountType, selectedIsActive]);

  // ============= Event Handlers =============

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateDiscount = async (discountData: Partial<Discount>) => {
    setIsCreating(true);
    try {
      await dispatch(createDiscount(discountData as any)).unwrap();

      // Refresh list
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;
      
      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      setCreateModalOpen(false);
      toast.success("Tạo mã giảm giá thành công");
    } catch (error: any) {
      console.error("Create discount error:", error);
      toast.error(
        error?.message || "Lỗi khi tạo mã giảm giá. Vui lòng thử lại."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setUpdateModalOpen(true);
  };

  const handleEditFromView = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewModalOpen(false);
    setUpdateModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setUpdateModalOpen(false);
    setSelectedDiscount(null);
    setIsUpdating(false);
  };

  const handleUpdateDiscount = async (discountData: Partial<Discount>) => {
    if (!selectedDiscount) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateDiscount({
          id: selectedDiscount._id,
          ...discountData,
        })
      ).unwrap();

      // Refresh list
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;

      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      handleCloseEditModal();
      toast.success("Cập nhật mã giảm giá thành công");
    } catch (error: any) {
      toast.error(
        error?.message || "Cập nhật mã giảm giá thất bại. Vui lòng thử lại."
      );
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

  const handleDiscountTypeFilterChange = (discountType: string) => {
    updateFilters({ discountType: discountType, page: 1 });
  };

  const handleActiveFilterChange = (isActive: boolean | null) => {
    updateFilters({ isActive: isActive, page: 1 });
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = async (discount: Discount) => {
    try {
      await dispatch(deleteDiscount(discount._id)).unwrap();

      // Refresh list
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;

      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      toast.success("Xóa mã giảm giá thành công");
    } catch (error) {
      toast.error("Xóa mã giảm giá thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewModalOpen(true);
  };

  // Calculate stats
  const totalDiscounts = pagination?.totalItems || discounts.length
  const activeDiscounts = discounts.filter((discount) => discount.isActive).length;
  const expiredDiscounts = discounts.filter(
    (discount) => new Date(discount.endDate) < new Date()
  ).length;
  const highUsageDiscounts = discounts.filter(
    (discount) => discount.usedCount >= discount.usageLimit * 0.8
  ).length;

  if (discountState?.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {discountState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DiscountsHeader onOpenCreate={handleOpenCreateModal} />

      <DiscountsStats
        totalDiscounts={totalDiscounts}
        activeDiscounts={activeDiscounts}
        expiredDiscounts={expiredDiscounts}
        highUsageDiscounts={highUsageDiscounts}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách mã giảm giá</CardTitle>
          <CardDescription>
            Quản lý tất cả mã giảm giá trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscountsTable
            discounts={discounts}
            searchTerm={searchTerm}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditDiscount}
            onDelete={handleDeleteDiscount}
            onView={handleViewDiscount}
            onDiscountTypeFilterChange={handleDiscountTypeFilterChange}
            onActiveFilterChange={handleActiveFilterChange}
            selectedDiscountType={selectedDiscountType}
            selectedIsActive={selectedIsActive}
          />

          <DiscountPagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

          <CreateModelDiscount
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onCreate={handleCreateDiscount}
            isLoading={isCreating}
          />

          <ViewModelDiscount
            open={viewModalOpen}
            onOpenChange={handleCloseModals}
            discount={selectedDiscount}
            onEdit={handleEditFromView}
          />

          <UpdateModelDiscount
            open={updateModalOpen}
            onOpenChange={handleCloseEditModal}
            discount={selectedDiscount}
            onUpdate={handleUpdateDiscount}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
