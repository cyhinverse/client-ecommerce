"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  getSearchSuggestions,
  getTrendingSearches,
  getHotKeywords,
} from "@/features/search/searchAction";
import { clearSuggestions } from "@/features/search/searchSlice";

const DEBOUNCE_DELAY = 300;
const MIN_QUERY_LENGTH = 2;

/**
 * Custom hook để quản lý search với autocomplete
 * Tối ưu: debounce, cache, cleanup
 */
export function useSearch() {
  const dispatch = useAppDispatch();
  const { suggestions, trending, hotKeywords, isLoading } = useAppSelector(
    (state) => state.search
  );
  
  const [query, setQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef<string>("");

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback((searchQuery: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Clear suggestions if query too short
    if (searchQuery.trim().length < MIN_QUERY_LENGTH) {
      dispatch(clearSuggestions());
      return;
    }

    // Skip if same query
    if (searchQuery === lastQueryRef.current) {
      return;
    }

    // Debounce API call
    debounceRef.current = setTimeout(() => {
      lastQueryRef.current = searchQuery;
      dispatch(getSearchSuggestions({ q: searchQuery.trim(), limit: 8 }));
    }, DEBOUNCE_DELAY);
  }, [dispatch]);

  // Handle query change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    fetchSuggestions(newQuery);
  }, [fetchSuggestions]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    dispatch(clearSuggestions());
    lastQueryRef.current = "";
  }, [dispatch]);

  // Fetch trending on mount (once)
  const fetchTrending = useCallback(() => {
    if (trending.length === 0) {
      dispatch(getTrendingSearches(10));
    }
  }, [dispatch, trending.length]);

  // Fetch hot keywords on mount (once)
  const fetchHotKeywords = useCallback(() => {
    if (hotKeywords.length === 0) {
      dispatch(getHotKeywords(5));
    }
  }, [dispatch, hotKeywords.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    clearSearch,
    suggestions,
    trending,
    hotKeywords,
    isLoading,
    fetchTrending,
    fetchHotKeywords,
  };
}

export default useSearch;
