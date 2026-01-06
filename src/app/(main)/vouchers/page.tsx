// VoucherPage - Taobao Light Style
"use client";
import { useState, useEffect } from "react";
import { Ticket, Store, Clock, Check, ChevronRight, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAllVouchers, getAvailableVouchers } from "@/features/discount/discountAction";
import { Voucher as VoucherType } from "@/types/voucher";
import { Shop } from "@/types/product";

// Extended voucher interface for UI state
interface Voucher extends Omit<VoucherType, 'shopId'> {
  shopId?: { _id: string; name: string; logo?: string } | string | Shop;
  isCollected?: boolean;
}

// Helper to get shop info from voucher
const getShopInfo = (shopId: Voucher['shopId']): { _id: string; name: string; logo?: string } | undefined => {
  if (!shopId) return undefined;
  if (typeof shopId === 'string') return { _id: shopId, name: 'Shop', logo: undefined };
  if ('name' in shopId) return { _id: shopId._id, name: shopId.name, logo: (shopId as any).logo };
  return undefined;
};

export default function VouchersPage() {
  const dispatch = useAppDispatch();
  const { vouchers: reduxVouchers, loading } = useAppSelector((state) => state.discount);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState<"all" | "percentage" | "fixed_amount">("all");

  // Fetch vouchers on mount
  useEffect(() => {
    dispatch(getAllVouchers({ isActive: true }));
  }, [dispatch]);

  // Map redux vouchers to UI vouchers with collected state
  const vouchers: Voucher[] = reduxVouchers.map(v => ({
    ...v,
    isCollected: collectedIds.has(v._id),
  }));

  const handleCollectVoucher = (voucherId: string) => {
    setCollectedIds(prev => new Set(prev).add(voucherId));
    toast.success("Đã lưu voucher thành công!");
  };

  const filteredVouchers = vouchers.filter(v => {
    if (activeTab === "platform" && v.scope !== "platform") return false;
    if (activeTab === "shop" && v.scope !== "shop") return false;
    if (filterType !== "all" && v.type !== filterType) return false;
    return true;
  });

  const platformVouchers = filteredVouchers.filter(v => v.scope === "platform");
  const shopVouchers = filteredVouchers.filter(v => v.scope === "shop");

  // Group shop vouchers by shop
  const shopVouchersByShop = shopVouchers.reduce((acc, voucher) => {
    const shopInfo = getShopInfo(voucher.shopId);
    const shopId = shopInfo?._id || "unknown";
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: shopInfo,
        vouchers: [],
      };
    }
    acc[shopId].vouchers.push(voucher);
    return acc;
  }, {} as Record<string, { shop: ReturnType<typeof getShopInfo>; vouchers: Voucher[] }>);

  // Loading state
  if (loading && vouchers.length === 0) {
    return (
      <div className="min-h-screen bg-background py-4 -mt-4 -mx-4 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E53935]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 -mt-4 -mx-4 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded border border-[#f0f0f0] mb-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-[#E53935]" />
              <h1 className="text-xl font-bold text-gray-800">Kho Voucher</h1>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#E53935]"
              >
                <option value="all">Tất cả loại</option>
                <option value="percentage">Giảm %</option>
                <option value="fixed_amount">Giảm tiền</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white rounded border border-[#f0f0f0] p-1 mb-4 w-full justify-start">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#FFEBEE] data-[state=active]:text-[#E53935]"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger 
              value="platform"
              className="data-[state=active]:bg-[#FFEBEE] data-[state=active]:text-[#E53935]"
            >
              Voucher nền tảng
            </TabsTrigger>
            <TabsTrigger 
              value="shop"
              className="data-[state=active]:bg-[#FFEBEE] data-[state=active]:text-[#E53935]"
            >
              Voucher Shop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
            {/* Platform Vouchers */}
            {platformVouchers.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <Ticket className="h-4 w-4" />
                  Voucher nền tảng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {platformVouchers.map((voucher) => (
                    <VoucherCard 
                      key={voucher._id} 
                      voucher={voucher} 
                      onCollect={handleCollectVoucher}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Shop Vouchers */}
            {Object.keys(shopVouchersByShop).length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <Store className="h-4 w-4" />
                  Voucher từ Shop
                </h2>
                {Object.values(shopVouchersByShop).map((group) => (
                  <div key={group.shop?._id} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-800 font-medium">{group.shop?.name}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.vouchers.map((voucher) => (
                        <VoucherCard 
                          key={voucher._id} 
                          voucher={voucher} 
                          onCollect={handleCollectVoucher}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="platform" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {platformVouchers.map((voucher) => (
                <VoucherCard 
                  key={voucher._id} 
                  voucher={voucher} 
                  onCollect={handleCollectVoucher}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shop" className="mt-0">
            {Object.values(shopVouchersByShop).map((group) => (
              <div key={group.shop?._id} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-800 font-medium">{group.shop?.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.vouchers.map((voucher) => (
                    <VoucherCard 
                      key={voucher._id} 
                      voucher={voucher} 
                      onCollect={handleCollectVoucher}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// VoucherCard Component
function VoucherCard({ 
  voucher, 
  onCollect 
}: { 
  voucher: Voucher; 
  onCollect: (id: string) => void;
}) {
  const formatValue = () => {
    if (voucher.type === "percentage") {
      return `${voucher.value}%`;
    }
    return `₫${voucher.value.toLocaleString('vi-VN')}`;
  };

  const usagePercent = Math.round((voucher.usageCount / voucher.usageLimit) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded border border-[#f0f0f0] overflow-hidden flex"
    >
      {/* Left - Value */}
      <div className="w-[100px] bg-[#FFEBEE] flex flex-col items-center justify-center p-3 border-r border-dashed border-[#FFCDD2]">
        <span className="text-2xl font-bold text-[#E53935]">{formatValue()}</span>
        <span className="text-[10px] text-[#E53935] mt-0.5">
          {voucher.type === "percentage" ? `Tối đa ₫${(voucher.maxValue || 0).toLocaleString('vi-VN')}` : "Giảm trực tiếp"}
        </span>
      </div>

      {/* Right - Info */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-800 text-sm">{voucher.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{voucher.description}</p>
          </div>
          {voucher.scope === "shop" && (
            <span className="text-[10px] text-[#E53935] border border-[#E53935] px-1 py-0.5 rounded shrink-0">
              Shop
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>Đơn tối thiểu ₫{voucher.minOrderValue.toLocaleString('vi-VN')}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Usage Progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E53935] rounded-full transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">Đã dùng {usagePercent}%</span>
          </div>
        </div>

        {/* Collect Button */}
        <div className="mt-2 pt-2 border-t border-border">
          {voucher.isCollected ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs border-gray-200 text-gray-400"
            >
              <Check className="h-3 w-3 mr-1" />
              Đã lưu
            </Button>
          ) : (
            <Button
              onClick={() => onCollect(voucher._id)}
              size="sm"
              className="w-full h-7 text-xs bg-[#E53935] hover:bg-[#D32F2F]"
            >
              Lưu ngay
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
