"use client";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  addToWishlist,
  removeFromWishlist,
  checkMultipleInWishlist,
} from "@/features/wishlist/wishlistAction";
import { toast } from "sonner";

/**
 * Custom hook để quản lý wishlist
 * Tối ưu: chỉ gọi API khi cần, cache kết quả trong Redux
 */
export function useWishlist() {
  const dispatch = useAppDispatch();
  const { wishlistMap, count, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Track pending checks to avoid duplicate API calls
  const pendingChecks = useRef<Set<string>>(new Set());
  const checkQueue = useRef<string[]>([]);
  const checkTimeout = useRef<NodeJS.Timeout | null>(null);

  // Batch check products - debounced
  const batchCheckProducts = useCallback((productIds: string[]) => {
    if (!isAuthenticated) return;
    
    // Filter out already known products
    const unknownIds = productIds.filter(
      (id) => wishlistMap[id] === undefined && !pendingChecks.current.has(id)
    );
    
    if (unknownIds.length === 0) return;
    
    // Add to queue
    unknownIds.forEach((id) => {
      checkQueue.current.push(id);
      pendingChecks.current.add(id);
    });
    
    // Debounce API call
    if (checkTimeout.current) {
      clearTimeout(checkTimeout.current);
    }
    
    checkTimeout.current = setTimeout(() => {
      const idsToCheck = [...new Set(checkQueue.current)];
      checkQueue.current = [];
      
      if (idsToCheck.length > 0) {
        dispatch(checkMultipleInWishlist(idsToCheck)).finally(() => {
          idsToCheck.forEach((id) => pendingChecks.current.delete(id));
        });
      }
    }, 100);
  }, [dispatch, isAuthenticated, wishlistMap]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistMap[productId] === true;
  }, [wishlistMap]);

  // Toggle wishlist
  const toggleWishlist = useCallback(async (productId: string, productName?: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }

    try {
      if (isInWishlist(productId)) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Đã xóa khỏi yêu thích");
        return false;
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success(productName ? `Đã thêm "${productName}" vào yêu thích` : "Đã thêm vào yêu thích");
        return true;
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
      return isInWishlist(productId);
    }
  }, [dispatch, isAuthenticated, isInWishlist]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkTimeout.current) {
        clearTimeout(checkTimeout.current);
      }
    };
  }, []);

  return {
    isInWishlist,
    toggleWishlist,
    batchCheckProducts,
    count,
    isLoading,
    isAuthenticated,
  };
}

export default useWishlist;
