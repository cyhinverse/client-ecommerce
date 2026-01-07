import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "@/types/search";
import {
  getSearchSuggestions,
  getTrendingSearches,
  getHotKeywords,
  advancedSearch,
} from "./searchAction";

const initialState: SearchState = {
  suggestions: null,
  trending: [],
  hotKeywords: [],
  results: [],
  facets: null,
  pagination: null,
  isLoading: false,
  isSuggestionsLoading: false,
  error: null,
  recentSearches: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = null;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.facets = null;
      state.pagination = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const keyword = action.payload.trim();
      if (!keyword) return;
      // Remove if exists and add to front
      state.recentSearches = [
        keyword,
        ...state.recentSearches.filter((s) => s !== keyword),
      ].slice(0, 10);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    resetSearchState: () => initialState,
    clearSearchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // =========================== GET SUGGESTIONS ===========================
    builder.addCase(getSearchSuggestions.pending, (state) => {
      state.isSuggestionsLoading = true;
    });
    builder.addCase(getSearchSuggestions.fulfilled, (state, action) => {
      state.isSuggestionsLoading = false;
      state.suggestions = action.payload;
    });
    builder.addCase(getSearchSuggestions.rejected, (state) => {
      state.isSuggestionsLoading = false;
      state.suggestions = null;
    });

    // =========================== GET TRENDING ===========================
    builder.addCase(getTrendingSearches.fulfilled, (state, action) => {
      state.trending = action.payload || [];
    });

    // =========================== GET HOT KEYWORDS ===========================
    builder.addCase(getHotKeywords.fulfilled, (state, action) => {
      state.hotKeywords = action.payload || [];
    });

    // =========================== ADVANCED SEARCH ===========================
    builder.addCase(advancedSearch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(advancedSearch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.results = action.payload.data || [];
      state.facets = action.payload.facets || null;
      state.pagination = action.payload.pagination || null;
    });
    builder.addCase(advancedSearch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Tìm kiếm thất bại";
    });
  },
});

export const {
  clearSuggestions,
  clearSearchResults,
  addRecentSearch,
  clearRecentSearches,
  resetSearchState,
  clearSearchError,
} = searchSlice.actions;

export default searchSlice.reducer;
