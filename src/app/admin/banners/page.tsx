"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  getBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/features/banner/bannerAction";
import { Filters } from "@/hooks/useUrlFilters";
import { BannerItem, CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";
import { BannersHeader } from "@/components/admin/banners/BannersHeader";
import { BannersStats } from "@/components/admin/banners/BannersStats";
import { BannersTable } from "@/components/admin/banners/BannersTable";
import { CreateBannerModal } from "@/components/admin/banners/CreateBannerModal";
import { EditBannerModal } from "@/components/admin/banners/EditBannerModal";
import { toast } from "sonner";

interface BannerFilters extends Filters {
  page: number;
  limit: number;
  search: string;
}

export default function BannersAdminPage() {
  const dispatch = useAppDispatch();
  const { banners, isLoading, error } = useAppSelector((state) => state.banner);

  const { filters, updateFilter, updateFilters } = useUrlFilters<BannerFilters>({
    defaultFilters: {
      page: 1,
      limit: 10,
      search: "",
    },
    basePath: "/admin/banners",
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);

  useEffect(() => {
    dispatch(getBannersAdmin({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
    }));
  }, [dispatch, filters.page, filters.limit, filters.search]);

  const handleCreateBanner = async (data: CreateBannerPayload) => {
    setIsProcessing(true);
    try {
      await dispatch(createBanner(data)).unwrap();
      toast.success("Banner created successfully");
      setCreateModalOpen(false);
      dispatch(getBannersAdmin({ page: filters.page, limit: filters.limit, search: filters.search }));
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to create banner");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateBanner = async (id: string, data: UpdateBannerPayload) => {
    setIsProcessing(true);
    try {
      await dispatch(updateBanner({ id, data })).unwrap();
      toast.success("Banner updated successfully");
      setEditModalOpen(false);
      setSelectedBanner(null);
      dispatch(getBannersAdmin({ page: filters.page, limit: filters.limit, search: filters.search }));
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to update banner");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBanner = async (banner: BannerItem) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await dispatch(deleteBanner(banner._id)).unwrap();
        toast.success("Banner deleted successfully");
        dispatch(getBannersAdmin({ page: filters.page, limit: filters.limit, search: filters.search }));
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to delete banner");
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <BannersHeader onAddBanner={() => setCreateModalOpen(true)} />

      <BannersStats 
        totalBanners={banners.length} 
        activeBanners={banners.filter(b => b.isActive).length}
      />

      <BannersTable
        banners={banners}
        searchTerm={filters.search}
        pageSize={filters.limit}
        isLoading={isLoading}
        onSearch={(val) => updateFilter("search", val)}
        onPageSizeChange={(val) => updateFilters({ limit: val, page: 1 })}
        onEdit={(banner) => {
          setSelectedBanner(banner);
          setEditModalOpen(true);
        }}
        onDelete={handleDeleteBanner}
      />

      <CreateBannerModal
        key={createModalOpen ? 'create-banner-open' : 'create-banner-closed'}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateBanner}
        isLoading={isProcessing}
      />
      <EditBannerModal
        key={selectedBanner ? `edit-banner-${selectedBanner._id}` : 'edit-banner-closed'}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedBanner(null);
        }}
        onUpdate={handleUpdateBanner}
        banner={selectedBanner}
        isLoading={isProcessing}
      />
    </div>
  );
}
