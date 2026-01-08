import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SearchParams } from "@/types/search";
import { extractApiData, extractApiError } from "@/utils/api";

// Get search suggestions (autocomplete)
export const getSearchSuggestions = createAsyncThunk(
  "search/getSuggestions",
  async (params: { q: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/suggestions", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get trending searches
export const getTrendingSearches = createAsyncThunk(
  "search/getTrending",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/trending", {
        params: { limit },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get hot keywords
export const getHotKeywords = createAsyncThunk(
  "search/getHotKeywords",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/hot-keywords", {
        params: { limit },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Advanced search with filters
export const advancedSearch = createAsyncThunk(
  "search/advanced",
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
