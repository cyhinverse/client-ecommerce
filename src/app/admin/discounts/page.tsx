"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { toast } from "sonner";
import {
  getAllDiscounts,
  deleteDiscount,
  updateDiscount,
  createDiscount,
  getDiscountStatistics,
} from "@/features/discount/discountAction";
import {
  Discount,
  DiscountFilters,
  CreateDiscountData,
} from "@/types/discount";
import { DiscountsHeader } from "@/components/admin/discounts/DiscountHeader";
import { DiscountsStats } from "@/components/admin/discounts/DiscountStats";
import { DiscountsTable } from "@/components/admin/discounts/DiscountTable";
import { PaginationControls } from "@/components/common/Pagination";
import { CreateModelDiscount } from "@/components/admin/discounts/CreateModelDiscount";
import { ViewModelDiscount } from "@/components/admin/discounts/ViewModelDiscount";
import { UpdateModelDiscount } from "@/components/admin/discounts/UpdateModelDiscount";

export default function AdminDiscountsPage() {
  const dispatch = useAppDispatch();
  const discountState = useAppSelector((state) => state.discount);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } =
    useUrlFilters<DiscountFilters>({
      defaultFilters: {
        page: 1,
        limit: 10,
        search: "",
        discountType: "",
        isActive: null,
      },
      basePath: "/admin/discounts",
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
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
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
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchTerm,
    selectedDiscountType,
    selectedIsActive,
  ]);

  // ============= Event Handlers =============

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateDiscount = async (discountData: Partial<Discount>) => {
    setIsCreating(true);
    try {
      await dispatch(
        createDiscount(discountData as CreateDiscountData)
      ).unwrap();

      // Refresh list
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;

      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      setCreateModalOpen(false);
      toast.success("Discount created successfully");
    } catch (error) {
      const err = error as Error;
      toast.error("Error creating discount: " + (err.message || "Unknown error"));
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
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;

      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      handleCloseEditModal();
      toast.success("Discount updated successfully");
    } catch (error) {
      const err = error as Error;
      toast.error("Update discount failed: " + (err.message || "Unknown error"));
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
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDiscountType) params.discountType = selectedDiscountType;
      if (selectedIsActive !== null) params.isActive = selectedIsActive;

      dispatch(getAllDiscounts(params));
      dispatch(getDiscountStatistics());

      toast.success("Discount deleted successfully");
    } catch (error) {
      const err = error as Error;
      toast.error("Delete discount failed: " + (err.message || "Unknown error"));
    }
  };

  const handleViewDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewModalOpen(true);
  };

  // Calculate stats
  const totalDiscounts = pagination?.totalItems || discounts.length;
  const activeDiscounts = discounts.filter(
    (discount) => discount.isActive
  ).length;
  const expiredDiscounts = discounts.filter(
    (discount) => new Date(discount.endDate) < new Date()
  ).length;
  const highUsageDiscounts = discounts.filter(
    (discount) => discount.usedCount >= discount.usageLimit * 0.8
  ).length;

  if (discountState?.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {discountState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <DiscountsHeader onOpenCreate={handleOpenCreateModal} />

      {/* Stats Section */}
      <DiscountsStats
        totalDiscounts={totalDiscounts}
        activeDiscounts={activeDiscounts}
        expiredDiscounts={expiredDiscounts}
        highUsageDiscounts={highUsageDiscounts}
      />

       {/* Main Content Area */}
        <DiscountsTable
            discounts={discounts}
            searchTerm={searchTerm}
            pageSize={pageSize}
            isLoading={discountState.loading}
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

          <div className="mt-6">
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              itemName="discounts"
            />
          </div>

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
            key={selectedDiscount?._id || "update-discount"}
            open={updateModalOpen}
            onOpenChange={handleCloseEditModal}
            discount={selectedDiscount}
            onUpdate={handleUpdateDiscount}
            isLoading={isUpdating}
          />
    </div>
  );
}
