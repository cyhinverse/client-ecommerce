"use client";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const discountState = useAppSelector((state) => state.discount);
  // Lấy params từ URL
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlDiscountType = searchParams.get("discountType") || "";
  const urlIsActive = searchParams.get("isActive");

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedDiscountType, setSelectedDiscountType] = useState(urlDiscountType);
  const [selectedIsActive, setSelectedIsActive] = useState<string | null>(
    urlIsActive
  );



  const discounts: Discount[] = discountState?.discounts;
  const pagination = discountState?.pagination;
  console.log(discounts)
  console.log(pagination)

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm mở modal tạo mới
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  // Hàm xử lý tạo discount mới
  const handleCreateDiscount = async (discountData: any) => {
    setIsCreating(true);
    try {
      const result = await dispatch(createDiscount(discountData)).unwrap();

      // Refresh danh sách
      fetchDiscounts();
      fetchStatistics();

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

  // Hàm đóng modal
  const handleCloseEditModal = () => {
    setUpdateModalOpen(false);
    setSelectedDiscount(null);
    setIsUpdating(false);
  };

  // Hàm lưu thay đổi
  const handleUpdateDiscount = async (discountData: any) => {
    if (!selectedDiscount) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateDiscount({
          id: selectedDiscount._id,
          ...discountData,
        })
      ).unwrap();

      // Refresh danh sách sau khi update
      fetchDiscounts();
      fetchStatistics();

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

  // Hàm fetch discounts với params hợp lệ
  const fetchDiscounts = () => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }
    if (selectedDiscountType && selectedDiscountType.trim() !== "") {
      params.discountType = selectedDiscountType.trim();
    }
    // Chỉ thêm isActive nếu có giá trị boolean hợp lệ
    if (selectedIsActive === "true" || selectedIsActive === "false") {
      params.isActive = selectedIsActive === "true";
    }

    dispatch(getAllDiscounts(params));
  };

  // Hàm fetch statistics
  const fetchStatistics = () => {
    dispatch(getDiscountStatistics());
  };

  const updateURL = (
    page: number,
    limit: number,
    search: string,
    discountType: string,
    isActive: string | null
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search && search.trim() !== "") {
      params.set("search", search);
    }
    if (discountType && discountType.trim() !== "") {
      params.set("discountType", discountType);
    }
    // Chỉ thêm isActive nếu có giá trị boolean hợp lệ
    if (isActive === "true" || isActive === "false") {
      params.set("isActive", isActive);
    }

    const url = `/admin/discounts?${params.toString()}`;
    console.log("Updating URL to:", url);
    router.push(url, { scroll: false });
  };

  // Fetch discounts khi URL params thay đổi
  useEffect(() => {
    fetchDiscounts();
    fetchStatistics();
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchTerm,
    selectedDiscountType,
    selectedIsActive,
  ]);

  // Đồng bộ state với URL params
  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
    setSelectedDiscountType(urlDiscountType);
    setSelectedIsActive(urlIsActive);
  }, [urlPage, urlLimit, urlSearch, urlDiscountType, urlIsActive]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, searchTerm, selectedDiscountType, selectedIsActive);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, searchTerm, selectedDiscountType, selectedIsActive);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, pageSize, value, selectedDiscountType, selectedIsActive);
  };

  const handleDiscountTypeFilterChange = (discountType: string) => {
    setSelectedDiscountType(discountType);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, discountType, selectedIsActive);
  };

  const handleActiveFilterChange = (isActive: boolean | null) => {
    // Convert boolean | null thành string | null
    const activeString = isActive === null ? null : isActive.toString();
    setSelectedIsActive(activeString);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, selectedDiscountType, activeString);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = async (discount: Discount) => {
    try {
      await dispatch(deleteDiscount(discount._id)).unwrap();

      // Refresh danh sách
      fetchDiscounts();
      fetchStatistics();

      toast.success("Xóa mã giảm giá thành công");
    } catch (error) {
      toast.error("Xóa mã giảm giá thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewModalOpen(true);
  };

  // Tính toán thống kê
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
            selectedIsActive={
              selectedIsActive === "true"
                ? true
                : selectedIsActive === "false"
                  ? false
                  : null
            }
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
