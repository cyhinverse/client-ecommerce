"use client";
import { memo, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  showText?: boolean;
}

/**
 * Reusable Wishlist Button Component
 * Tối ưu: memo để tránh re-render không cần thiết
 */
export const WishlistButton = memo(function WishlistButton({
  productId,
  productName,
  className,
  size = "md",
  variant = "icon",
  showText = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isAuthenticated } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId, productName);
  }, [productId, productName, toggleWishlist]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
          isWishlisted
            ? "border-[#E53935] bg-[#FFEBEE] text-[#E53935]"
            : "border-gray-200 bg-white text-gray-600 hover:border-[#E53935] hover:text-[#E53935]",
          className
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isWishlisted && "fill-current"
          )}
        />
        {showText && (
          <span className="text-sm font-medium">
            {isWishlisted ? "Đã thích" : "Yêu thích"}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        sizeClasses[size],
        isWishlisted
          ? "bg-[#FFEBEE] text-[#E53935]"
          : "bg-white/90 text-gray-500 hover:bg-white hover:text-[#E53935]",
        className
      )}
      title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isWishlisted && "fill-current"
        )}
      />
    </button>
  );
});

export default WishlistButton;
