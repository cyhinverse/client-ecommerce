/**
 * API Module - Barrel Export
 * Centralized exports for all API-related utilities
 */

// Axios instance
export { default as api, injectStore } from "./api";

// API utilities
export {
  extractApiData,
  extractPaginatedData,
  extractApiError,
  getLocalizedError,
  ERROR_MESSAGES,
} from "./utils";

// Types
export type {
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
  ApiError,
} from "./utils";
