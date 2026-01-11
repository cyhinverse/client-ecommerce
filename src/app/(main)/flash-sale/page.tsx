"use client";
import { memo, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useFlashSaleWithCountdown } from "@/hooks/queries/useFlashSale";
import { FlashSaleProduct } from "@/types/flash-sale";
import { cn } from "@/lib/utils";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { WishlistButton } from "@/components/common/WishlistButton";

// Time Slot Component
const TimeSlot = memo(function TimeSlot({
  slot,
  isActive,
  onClick,
}: {
  slot: { startTime: string; endTime: string; label: string };
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center px-6 py-3 rounded-lg transition-all min-w-[100px]",
        isActive
          ? "bg-[#E53935] text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      )}
    >
      <span className="text-lg font-bold">{slot.startTime}</span>
      <span
        className={cn("text-xs", isActive ? "text-white/80" : "text-gray-400")}
      >
        {slot.label}
      </span>
    </button>
  );
});

// Countdown Timer
const CountdownTimer = memo(function CountdownTimer({
  seconds,
}: {
  seconds: number;
}) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-white" />
      <span className="text-white text-sm">Kết thúc trong</span>
      <div className="flex items-center gap-1">
        <span className="bg-white text-[#E53935] font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">
          {hours.toString().padStart(2, "0")}
        </span>
        <span className="text-white font-bold">:</span>
        <span className="bg-white text-[#E53935] font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">
          {minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-white font-bold">:</span>
        <span className="bg-white text-[#E53935] font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">
          {secs.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
});

// Progress Bar
const SoldProgress = memo(function SoldProgress({
  percent,
}: {
  percent: number;
}) {
  return (
    <div className="relative h-5 bg-[#FFCDD2] rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF5722] to-[#E53935] rounded-full transition-all duration-300"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {percent >= 50 ? `Đã bán ${percent}%` : "Đang bán chạy"}
      </span>
    </div>
  );
});

// Flash Sale Product Card (Full version)
const FlashSaleProductCard = memo(function FlashSaleProductCard({
  product,
}: {
  product: FlashSaleProduct;
}) {
  const { flashSaleInfo } = product;
  const productImage =
    product.variants?.[0]?.images?.[0] || "/images/placeholder.png";

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
      {/* Image */}
      <Link href={`/products/${product.slug || product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Discount Badge */}
          {flashSaleInfo?.discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded">
              -{flashSaleInfo.discount}%
            </div>
          )}
          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <WishlistButton
              productId={product._id}
              productName={product.name}
              size="sm"
            />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#E53935] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[#E53935] text-xs">₫</span>
          <span className="font-bold text-lg text-[#E53935]">
            {(flashSaleInfo?.salePrice || 0).toLocaleString("vi-VN")}
          </span>
        </div>
        {flashSaleInfo?.originalPrice > flashSaleInfo?.salePrice && (
          <span className="text-xs text-gray-400 line-through">
            ₫{flashSaleInfo.originalPrice.toLocaleString("vi-VN")}
          </span>
        )}

        {/* Progress */}
        <div className="mt-3">
          <SoldProgress percent={flashSaleInfo?.soldPercent || 0} />
        </div>
      </div>
    </div>
  );
});

// Time slots data
const TIME_SLOTS = [
  { startTime: "00:00", endTime: "06:00", label: "Đêm khuya" },
  { startTime: "06:00", endTime: "10:00", label: "Sáng sớm" },
  { startTime: "10:00", endTime: "14:00", label: "Trưa" },
  { startTime: "14:00", endTime: "18:00", label: "Chiều" },
  { startTime: "18:00", endTime: "22:00", label: "Tối" },
  { startTime: "22:00", endTime: "24:00", label: "Khuya" },
];

export default function FlashSalePage() {
  const [activeSlot, setActiveSlot] = useState(0);
  const { products, isLoading, error, fetchFlashSale } =
    useFlashSaleWithCountdown();

  // Get current slot based on time
  const currentSlotIndex = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) return 0;
    if (hour < 10) return 1;
    if (hour < 14) return 2;
    if (hour < 18) return 3;
    if (hour < 22) return 4;
    return 5;
  }, []);

  // Remaining seconds for countdown
  const remainingSeconds = useMemo(() => {
    if (products.length > 0) {
      return products[0].flashSaleInfo?.remainingSeconds || 0;
    }
    return 0;
  }, [products]);

  const handleSlotChange = useCallback((index: number) => {
    setActiveSlot(index);
    // Could fetch different time slot products here
    // fetchFlashSale(TIME_SLOTS[index].startTime);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#E53935] to-[#FF5722] py-6">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-white fill-white" />
              <h1 className="text-2xl font-bold text-white">FLASH SALE</h1>
            </div>
            {remainingSeconds > 0 && (
              <CountdownTimer seconds={remainingSeconds} />
            )}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-20">
        <div className="container mx-auto px-4 max-w-[1400px] py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TIME_SLOTS.map((slot, index) => (
              <TimeSlot
                key={slot.startTime}
                slot={slot}
                isActive={index === activeSlot}
                onClick={() => handleSlotChange(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 max-w-[1400px] py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <SpinnerLoading size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Không thể tải sản phẩm Flash Sale</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có sản phẩm Flash Sale</p>
            <p className="text-gray-400 text-sm mt-2">
              Quay lại sau để xem các ưu đãi mới
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2 bg-[#E53935] text-white rounded-full hover:bg-[#D32F2F] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <FlashSaleProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
