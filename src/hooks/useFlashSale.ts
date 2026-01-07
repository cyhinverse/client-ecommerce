"use client";
import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  getActiveFlashSale,
  getFlashSaleSchedule,
} from "@/features/flash-sale/flashSaleAction";
import { updateCountdown } from "@/features/flash-sale/flashSaleSlice";

/**
 * Custom hook để quản lý Flash Sale với countdown tự động
 * Tối ưu: chỉ chạy interval khi có products, cleanup đúng cách
 */
export function useFlashSale(autoFetch = true) {
  const dispatch = useAppDispatch();
  const { products, schedule, pagination, nextSaleTime, isLoading, error } = 
    useAppSelector((state) => state.flashSale);
  
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Fetch flash sale data
  const fetchFlashSale = useCallback((params?: { page?: number; limit?: number }) => {
    return dispatch(getActiveFlashSale(params || {}));
  }, [dispatch]);

  // Fetch schedule
  const fetchSchedule = useCallback(() => {
    return dispatch(getFlashSaleSchedule());
  }, [dispatch]);

  // Start countdown
  const startCountdown = useCallback(() => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    
    countdownInterval.current = setInterval(() => {
      if (isMounted.current) {
        dispatch(updateCountdown());
      }
    }, 1000);
  }, [dispatch]);

  // Stop countdown
  const stopCountdown = useCallback(() => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, []);

  // Auto fetch on mount
  useEffect(() => {
    isMounted.current = true;
    
    if (autoFetch) {
      fetchFlashSale();
      fetchSchedule();
    }
    
    return () => {
      isMounted.current = false;
      stopCountdown();
    };
  }, [autoFetch, fetchFlashSale, fetchSchedule, stopCountdown]);

  // Start/stop countdown based on products
  useEffect(() => {
    if (products.length > 0) {
      startCountdown();
    } else {
      stopCountdown();
    }
    
    return () => stopCountdown();
  }, [products.length, startCountdown, stopCountdown]);

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  }, []);

  return {
    products,
    schedule,
    pagination,
    nextSaleTime,
    isLoading,
    error,
    fetchFlashSale,
    fetchSchedule,
    formatTime,
  };
}

export default useFlashSale;
