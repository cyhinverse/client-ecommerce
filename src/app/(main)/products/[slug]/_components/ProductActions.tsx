"use client";

import SpinnerLoading from "@/components/common/SpinnerLoading";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ProductActions({
  onAddToCart,
  onBuyNow,
  disabled = false,
  loading = false,
}: ProductActionsProps) {
  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-4 mt-8 pb-6">
        <button
          onClick={onAddToCart}
          disabled={disabled || loading}
          className={cn(
            "w-[180px] h-12 rounded-full border border-[#E53935] text-[#E53935] font-bold text-sm bg-[#FFEBEE] hover:bg-[#FFCDD2] transition-colors flex items-center justify-center gap-2",
            (disabled || loading) && "opacity-50 cursor-not-allowed",
          )}
        >
          {loading ? (
            <SpinnerLoading size={16} noWrapper className="mr-2" />
          ) : (
            "Thêm vào giỏ"
          )}
        </button>

        <button
          onClick={onBuyNow}
          disabled={disabled || loading}
          className={cn(
            "w-[180px] h-12 rounded-full bg-[#E53935] text-white font-bold text-sm hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center justify-center gap-2",
            (disabled || loading) && "opacity-50 cursor-not-allowed",
          )}
        >
          {loading ? (
            <SpinnerLoading size={16} noWrapper className="mr-2" />
          ) : (
            "Mua ngay"
          )}
        </button>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 z-50 safe-area-inset-bottom">
        <button
          onClick={onAddToCart}
          disabled={disabled || loading}
          className={cn(
            "flex-1 h-12 rounded-full border border-[#E53935] text-[#E53935] font-bold text-sm bg-[#FFEBEE] flex items-center justify-center gap-2",
            (disabled || loading) && "opacity-50 cursor-not-allowed",
          )}
        >
          {loading ? (
            <SpinnerLoading size={16} noWrapper className="mr-2" />
          ) : (
            "Thêm vào giỏ"
          )}
        </button>

        <button
          onClick={onBuyNow}
          disabled={disabled || loading}
          className={cn(
            "flex-1 h-12 rounded-full bg-[#E53935] text-white font-bold text-sm flex items-center justify-center gap-2",
            (disabled || loading) && "opacity-50 cursor-not-allowed",
          )}
        >
          {loading ? (
            <SpinnerLoading size={16} noWrapper className="mr-2" />
          ) : (
            "Mua ngay"
          )}
        </button>
      </div>
    </>
  );
}

export default ProductActions;
