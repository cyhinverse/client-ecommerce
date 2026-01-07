"use client";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  getForYouRecommendations,
  getRecentlyViewed,
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getHomepageRecommendations,
  trackProductView,
} from "@/features/recommendation/recommendationAction";

/**
 * Custom hook để quản lý recommendations
 * Tối ưu: cache results, debounce tracking, avoid duplicate fetches
 */
export function useRecommendation() {
  const dispatch = useAppDispatch();
  const { 
    forYou, 
    recentlyViewed, 
    frequentlyBoughtTogether, 
    similar, 
    homepage,
    isLoading, 
    error 
  } = useAppSelector((state) => state.recommendation);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Track fetched states to avoid duplicate calls
  const fetchedRef = useRef<Set<string>>(new Set());
  const trackingQueue = useRef<Set<string>>(new Set());
  const trackTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch for you recommendations
  const fetchForYou = useCallback((limit?: number) => {
    const key = `forYou-${limit}`;
    if (fetchedRef.current.has(key)) return;
    fetchedRef.current.add(key);
    return dispatch(getForYouRecommendations(limit));
  }, [dispatch]);

  // Fetch recently viewed
  const fetchRecentlyViewed = useCallback((limit?: number) => {
    if (!isAuthenticated) return;
    const key = `recentlyViewed-${limit}`;
    if (fetchedRef.current.has(key)) return;
    fetchedRef.current.add(key);
    return dispatch(getRecentlyViewed(limit));
  }, [dispatch, isAuthenticated]);

  // Fetch frequently bought together
  const fetchFBT = useCallback((productId: string, limit?: number) => {
    const key = `fbt-${productId}`;
    if (fetchedRef.current.has(key)) return;
    fetchedRef.current.add(key);
    return dispatch(getFrequentlyBoughtTogether({ productId, limit }));
  }, [dispatch]);

  // Fetch similar products
  const fetchSimilar = useCallback((productId: string, limit?: number) => {
    const key = `similar-${productId}`;
    if (fetchedRef.current.has(key)) return;
    fetchedRef.current.add(key);
    return dispatch(getSimilarProducts({ productId, limit }));
  }, [dispatch]);

  // Fetch homepage recommendations
  const fetchHomepage = useCallback(() => {
    const key = "homepage";
    if (fetchedRef.current.has(key)) return;
    fetchedRef.current.add(key);
    return dispatch(getHomepageRecommendations());
  }, [dispatch]);

  // Track product view - debounced
  const trackView = useCallback((productId: string) => {
    if (!isAuthenticated) return;
    if (trackingQueue.current.has(productId)) return;
    
    trackingQueue.current.add(productId);
    
    // Debounce tracking
    if (trackTimeout.current) {
      clearTimeout(trackTimeout.current);
    }
    
    trackTimeout.current = setTimeout(() => {
      trackingQueue.current.forEach((id) => {
        dispatch(trackProductView(id));
      });
      trackingQueue.current.clear();
    }, 500);
  }, [dispatch, isAuthenticated]);

  // Reset fetched cache (useful when user logs in/out)
  const resetCache = useCallback(() => {
    fetchedRef.current.clear();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (trackTimeout.current) {
        clearTimeout(trackTimeout.current);
      }
    };
  }, []);

  return {
    forYou,
    recentlyViewed,
    frequentlyBoughtTogether,
    similar,
    homepage,
    isLoading,
    error,
    fetchForYou,
    fetchRecentlyViewed,
    fetchFBT,
    fetchSimilar,
    fetchHomepage,
    trackView,
    resetCache,
  };
}

export default useRecommendation;
