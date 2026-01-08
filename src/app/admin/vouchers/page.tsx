"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherStatistics,
} from "@/features/voucher/voucherAction";
import { VouchersHeader } from "@/components/admin/vouchers/VouchersHeader";
import { VouchersStats } from "@/components/admin/vouchers/VouchersStats";
import { DiscountsTable } from "@/components/admin/vouchers/VouchersTable";
import { CreateModelDiscount } from "@/components/admin/vouchers/CreateVoucherModal";
import { UpdateModelDiscount } from "@/components/admin/vouchers/UpdateVoucherModal";
import { ViewModelDiscount } from "@/components/admin/vouchers/ViewVoucherModal";
import { Voucher, CreateVoucherData, UpdateVoucherData, VoucherFilters } from "@/types/voucher";
import { toast } from "sonner";
import {PaginationControls} from "@/components/common/Pagination";

export default function VouchersPage() {
  const dispatch = useAppDispatch();
  const { vouchers, loading, pagination, statistics } = useAppSelector(
    (state) => state.voucher
  );

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIsActive, setSelectedIsActive] = useState<boolean | null>(null);
  const [selectedScope, setSelectedScope] = useState("all");

  // Fetch vouchers
  const fetchVouchers = useCallback(() => {
    const params: Partial<VoucherFilters> = {
      page: currentPage,
      limit: pageSize,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedType !== "all") params.type = selectedType === "percent" ? "percentage" : "fixed_amount";
    if (selectedIsActive !== null) params.isActive = selectedIsActive;
    if (selectedScope !== "all") params.scope = selectedScope;

    dispatch(getAllVouchers(params));
  }, [dispatch, currentPage, pageSize, searchTerm, selectedType, selectedIsActive, selectedScope]);


  useEffect(() => {
    fetchVouchers();
    dispatch(getVoucherStatistics());
  }, [fetchVouchers, dispatch]);

  // Handlers
  const handleCreate = async (data: CreateVoucherData) => {
    try {
      await dispatch(createVoucher(data)).unwrap();
      toast.success("Voucher created successfully");
      setIsCreateOpen(false);
      fetchVouchers();
    } catch (error) {
      toast.error("Failed to create voucher");
    }
  };

  const handleUpdate = async (data: UpdateVoucherData) => {
    if (!selectedVoucher) return;
    try {
      await dispatch(updateVoucher({ id: selectedVoucher._id, ...data })).unwrap();
      toast.success("Voucher updated successfully");
      setIsUpdateOpen(false);
      setSelectedVoucher(null);
      fetchVouchers();
    } catch (error) {
      toast.error("Failed to update voucher");
    }
  };

  const handleDelete = async (voucher: Voucher) => {
    if (!confirm(`Are you sure you want to delete voucher "${voucher.code}"?`)) return;
    try {
      await dispatch(deleteVoucher(voucher._id)).unwrap();
      toast.success("Voucher deleted successfully");
      fetchVouchers();
    } catch (error) {
      toast.error("Failed to delete voucher");
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsUpdateOpen(true);
  };

  const handleView = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsViewOpen(true);
  };

  // Calculate stats
  const totalVouchers = statistics?.totalVouchers || vouchers.length;
  const activeVouchers = statistics?.activeVouchers || vouchers.filter((v) => v.isActive).length;
  const expiredVouchers = statistics?.expiredVouchers || vouchers.filter((v) => new Date(v.endDate) < new Date()).length;
  const highUsageVouchers = vouchers.filter((v) => (v.usageCount / v.usageLimit) > 0.8).length;

  return (
    <div className="space-y-8">
      <VouchersHeader onOpenCreate={() => setIsCreateOpen(true)} />

      <VouchersStats
        totalVouchers={totalVouchers}
        activeVouchers={activeVouchers}
        expiredVouchers={expiredVouchers}
        highUsageVouchers={highUsageVouchers}
      />

      <DiscountsTable
        discounts={vouchers}
        searchTerm={searchTerm}
        pageSize={pageSize}
        isLoading={loading}
        onSearch={setSearchTerm}
        onPageSizeChange={setPageSize}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDiscountTypeFilterChange={setSelectedType}
        onActiveFilterChange={setSelectedIsActive}
        onScopeFilterChange={setSelectedScope}
        selectedDiscountType={selectedType}
        selectedIsActive={selectedIsActive}
        selectedScope={selectedScope}
      />

      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}

      <CreateModelDiscount
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
        isLoading={loading}
      />

      <UpdateModelDiscount
        key={selectedVoucher?._id}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        discount={selectedVoucher}
        onUpdate={handleUpdate}
        isLoading={loading}
      />

      <ViewModelDiscount
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        discount={selectedVoucher}
        onEdit={handleEdit}
      />
    </div>
  );
}
