"use client";

import React from "react";
import { Ticket, Store, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Voucher } from "@/types/voucher";
import { cn } from "@/lib/utils";

interface VoucherCardProps {
  voucher: Voucher;
  isCollected?: boolean;
  onCollect?: (id: string) => void;
  className?: string;
  variant?: "default" | "compact" | "horizontal";
}

export function VoucherCard({
  voucher,
  isCollected,
  onCollect,
  className,
  variant = "default",
}: VoucherCardProps) {
  const formatValue = () => {
    if (voucher.type === "percentage") {
      return `${voucher.value}%`;
    }
    return `₫${voucher.value.toLocaleString("vi-VN")}`;
  };

  const usagePercent = Math.min(
    100,
    Math.round((voucher.usageCount / voucher.usageLimit) * 100)
  );

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(voucher.code);
    toast.success(`Đã sao chép mã: ${voucher.code}`);
  };

  const isPlatform = voucher.scope === "platform";
  const accentColor = isPlatform ? "text-primary" : "text-blue-500";
  const accentBg = isPlatform ? "bg-primary" : "bg-blue-500";

  // Compact variant for daily vouchers grid
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all",
          className
        )}
      >
        {/* Discount Badge */}
        <div className={cn("py-3 px-3 text-center bg-[#f7f7f7]")}>
          <div className={cn("text-xl font-bold", accentColor)}>
            {formatValue()}
          </div>
          <div className="text-xs text-muted-foreground">
            {voucher.type === "percentage" ? "Giảm" : "Giảm"}
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f7]" />
          <div className="absolute right-0 top-0 w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f7]" />
          <div className="border-t border-dashed border-gray-100" />
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-600 line-clamp-1 mb-2">
            {voucher.name}
          </p>

          {isCollected ? (
            <div className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#f7f7f7] text-gray-400 text-xs">
              <Check className="w-3 h-3" />
              Đã lưu
            </div>
          ) : (
            <button
              onClick={() => onCollect?.(voucher._id)}
              className={cn(
                "w-full py-1.5 rounded-lg text-white text-xs font-medium transition-opacity hover:opacity-90",
                accentBg
              )}
            >
              Lưu
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Horizontal variant
  if (variant === "horizontal") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "flex bg-white rounded-xl overflow-hidden transition-all",
          className
        )}
      >
        {/* Left - Value Section */}
        <div
          className={cn(
            "w-24 flex flex-col items-center justify-center p-3 relative shrink-0 bg-[#f7f7f7]"
          )}
        >
          {/* Punch-out circles */}
          <div className="absolute top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f7]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 translate-x-1/2 translate-y-1/2 rounded-full bg-[#f7f7f7]" />

          <span className={cn("text-lg font-bold", accentColor)}>
            {formatValue()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isPlatform ? "Toàn sàn" : "Shop"}
          </span>
        </div>

        {/* Right - Info Section */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                {voucher.name}
              </h3>
              <button
                onClick={handleCopyCode}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <Copy size={12} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Đơn tối thiểu ₫{voucher.minOrderValue.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            {/* Progress */}
            <div className="flex-1">
              <div className="h-1 bg-[#f7f7f7] rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", accentBg)}
                  style={{ width: `${usagePercent}%`, opacity: 0.7 }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground">
                Đã dùng {usagePercent}%
              </span>
            </div>

            {isCollected ? (
              <span className="text-[10px] text-emerald-500 font-medium">
                Đã Lưu
              </span>
            ) : (
              <button
                onClick={() => onCollect?.(voucher._id)}
                className={cn(
                  "text-[10px] font-medium px-3 py-1 rounded-lg text-white transition-opacity hover:opacity-90",
                  accentBg
                )}
              >
                Lưu
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default Card Variant - Rustic Style
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl overflow-hidden transition-all flex flex-col h-full",
        className
      )}
    >
      {/* Header with discount value */}
      <div className="relative py-5 px-4 text-center bg-[#f7f7f7]">
        {/* Scope badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {isPlatform ? (
            <Ticket size={12} className={accentColor} />
          ) : (
            <Store size={12} className={accentColor} />
          )}
          <span className={cn("text-[10px] font-medium", accentColor)}>
            {isPlatform ? "Toàn sàn" : "Cửa hàng"}
          </span>
        </div>

        {/* Discount value */}
        <div className={cn("text-3xl font-bold tracking-tight", accentColor)}>
          {formatValue()}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {voucher.type === "percentage" ? "Giảm" : "Giảm trực tiếp"}
        </div>
      </div>

      {/* Dotted divider with punch-out effect */}
      <div className="relative">
        <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f7]" />
        <div className="absolute right-0 top-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f7]" />
        <div className="border-t border-dashed border-gray-100" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2 mb-2">
            {voucher.name}
          </h3>

          <div className="space-y-1 text-[11px] text-muted-foreground">
            <p>
              Mã:{" "}
              <span className="font-medium text-gray-700">{voucher.code}</span>
            </p>
            <p>
              Đơn tối thiểu: ₫{voucher.minOrderValue.toLocaleString("vi-VN")}
            </p>
            <p>HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}</p>
          </div>
        </div>

        {/* Usage progress */}
        <div className="mt-4 mb-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Đã sử dụng</span>
            <span>{usagePercent}%</span>
          </div>
          <div className="h-1.5 bg-[#f7f7f7] rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", accentBg)}
              style={{ width: `${usagePercent}%`, opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 h-9 rounded-lg bg-[#f7f7f7] text-gray-600 text-xs font-medium transition-colors hover:bg-gray-100 flex items-center justify-center gap-1"
          >
            <Copy size={12} />
            Sao chép
          </button>

          {isCollected ? (
            <div className="flex-1 h-9 rounded-lg bg-[#f7f7f7] text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
              <Check size={12} />
              Đã lưu
            </div>
          ) : (
            <button
              onClick={() => onCollect?.(voucher._id)}
              className={cn(
                "flex-1 h-9 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90",
                accentBg
              )}
            >
              Lưu ngay
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
