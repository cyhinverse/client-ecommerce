// VoucherPage - Taobao Gentle Style
"use client";

import { useState, useMemo } from "react";
import {
  Gift,
  Sparkles,
  Search,
  Clock,
  Tag,
  Ticket,
  Store,
  Crown,
  Timer,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useVouchers } from "@/hooks/queries";
import { VoucherCard } from "@/components/vouchers/VoucherCard";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Input } from "@/components/ui/input";

export default function VouchersPage() {
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "percentage" | "fixed_amount"
  >("all");

  // Fetch vouchers using React Query
  const { data: vouchersData, isLoading } = useVouchers({ isActive: true });
  const allVouchers = useMemo(
    () => vouchersData?.vouchers || [],
    [vouchersData],
  );

  const handleCollectVoucher = (voucherId: string) => {
    setCollectedIds((prev) => new Set(prev).add(voucherId));
    toast.success("Đã lưu voucher vào ví của bạn!");
  };

  // Get current time for countdown display
  const now = new Date();
  const hoursLeft = 24 - now.getHours();
  const minutesLeft = 60 - now.getMinutes();

  // Vouchers of the Day - Top featured vouchers
  const dailyVouchers = useMemo(() => {
    return [...allVouchers]
      .sort((a, b) => {
        if (a.scope === "platform" && b.scope !== "platform") return -1;
        if (a.scope !== "platform" && b.scope === "platform") return 1;
        return b.value - a.value;
      })
      .slice(0, 6);
  }, [allVouchers]);

  const filteredVouchers = useMemo(() => {
    return allVouchers.filter((v) => {
      if (activeTab === "platform" && v.scope !== "platform") return false;
      if (activeTab === "shop" && v.scope !== "shop") return false;
      if (filterType !== "all" && v.type !== filterType) return false;
      if (
        searchQuery &&
        !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.code.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [allVouchers, activeTab, filterType, searchQuery]);

  if (isLoading && allVouchers.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-16 h-16 rounded-full bg-[#f7f7f7] flex items-center justify-center">
          <SpinnerLoading size={32} />
        </div>
        <p className="text-muted-foreground text-sm">Đang tải ưu đãi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Simple Header */}
      <div className="bg-[#f7f7f7] py-8 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-gray-800 text-xl font-semibold">
                  Trung tâm Voucher
                </h1>
                <p className="text-muted-foreground text-xs">
                  Săn mã giảm giá mỗi ngày
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-gray-600 text-sm font-medium">
                Còn {hoursLeft}h {minutesLeft}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Vouchers Section */}
      <div className="max-w-[1200px] mx-auto px-4 mt-6">
        <div className="bg-[#f7f7f7] rounded-2xl overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-800">
                Ưu đãi hôm nay
              </span>
              <span className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded-full">
                {dailyVouchers.length} mã
              </span>
            </div>
            <button className="flex items-center gap-1 text-primary text-sm hover:opacity-80 transition-opacity">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Daily Vouchers Grid */}
          <div className="p-4 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dailyVouchers.map((v) => (
                <VoucherCard
                  key={v._id}
                  variant="compact"
                  voucher={v}
                  isCollected={collectedIds.has(v._id)}
                  onCollect={handleCollectVoucher}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 mt-4">
        <div className="bg-[#f7f7f7] rounded-2xl overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã giảm giá..."
                  className="pl-10 h-10 bg-white border-none rounded-xl text-sm focus-visible:ring-0"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as typeof filterType)
                  }
                  className="h-10 px-4 bg-white border-none rounded-xl text-sm text-gray-600 focus:outline-none"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="percentage">Giảm %</option>
                  <option value="fixed_amount">Giảm tiền</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-4">
              <TabsList className="bg-white h-11 p-1 rounded-xl gap-1">
                <TabsTrigger
                  value="all"
                  className="h-9 px-5 rounded-lg text-sm font-medium text-gray-500 data-[state=active]:bg-[#f7f7f7] data-[state=active]:text-gray-800 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="platform"
                  className="h-9 px-5 rounded-lg text-sm font-medium text-gray-500 data-[state=active]:bg-[#f7f7f7] data-[state=active]:text-primary transition-colors"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Toàn sàn
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className="h-9 px-5 rounded-lg text-sm font-medium text-gray-500 data-[state=active]:bg-[#f7f7f7] data-[state=active]:text-blue-500 transition-colors"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Cửa hàng
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery + filterType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent
                  value={activeTab}
                  className="mt-0 p-4 focus-visible:outline-none"
                >
                  {filteredVouchers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredVouchers.map((voucher) => (
                        <VoucherCard
                          key={voucher._id}
                          voucher={voucher}
                          isCollected={collectedIds.has(voucher._id)}
                          onCollect={handleCollectVoucher}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
                        <Ticket className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">
                        Không tìm thấy voucher
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Thử thay đổi bộ lọc hoặc quay lại sau nhé!
                      </p>
                      <button
                        className="px-6 py-2.5 bg-white text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterType("all");
                          setActiveTab("all");
                        }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-[1200px] mx-auto px-4 mt-4">
        <div className="bg-[#f7f7f7] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm mb-1">
                Mẹo săn voucher
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Voucher mới sẽ được cập nhật mỗi ngày lúc 00:00. Hãy lưu voucher
                vào ví để sử dụng khi thanh toán. Mỗi voucher có giới hạn số
                lượng, hãy nhanh tay nhé!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
