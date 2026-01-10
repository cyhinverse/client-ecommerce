import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";
import { endpoint_permission } from "@/constants/enpoint";

export interface PermissionAuditLog {
  _id: string;
  action: "grant" | "revoke";
  adminId: string;
  targetUserId: string;
  permission: string;
  previousPermissions?: string[];
  newPermissions?: string[];
  createdAt: string;
}

export interface UpdatePermissionsPayload {
  userId: string;
  permissions: string[];
}

// Fetch current user's permissions
export const fetchMyPermissions = createAsyncThunk(
  "permission/fetchMyPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(endpoint_permission.getMyPermissions, {
        withCredentials: true,
      });
      return extractApiData(response) as string[];
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Fetch all available permissions (for admin UI)
export const fetchAllPermissions = createAsyncThunk(
  "permission/fetchAllPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(endpoint_permission.getAll, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Fetch role default permissions
export const fetchRolePermissions = createAsyncThunk(
  "permission/fetchRolePermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(endpoint_permission.getRolePermissions, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Fetch specific user's permissions (admin only)
export const fetchUserPermissions = createAsyncThunk(
  "permission/fetchUserPermissions",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        endpoint_permission.getUserPermissions(userId),
        { withCredentials: true }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Update user's permissions (admin only)
export const updateUserPermissions = createAsyncThunk(
  "permission/updateUserPermissions",
  async (
    { userId, permissions }: UpdatePermissionsPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(
        endpoint_permission.updateUserPermissions(userId),
        { permissions },
        { withCredentials: true }
      );
      return { userId, permissions, data: extractApiData(response) };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Update current user's permissions in state (used after admin updates)
export const updateMyPermissions = createAsyncThunk(
  "permission/updateMyPermissions",
  async ({ userId, permissions }: UpdatePermissionsPayload) => {
    return { userId, permissions };
  }
);

// Grant single permission to user (admin only)
export const grantPermission = createAsyncThunk(
  "permission/grantPermission",
  async (
    { userId, permission }: { userId: string; permission: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        endpoint_permission.grantPermission(userId),
        { permission },
        { withCredentials: true }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Revoke single permission from user (admin only)
export const revokePermission = createAsyncThunk(
  "permission/revokePermission",
  async (
    { userId, permission }: { userId: string; permission: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        endpoint_permission.revokePermission(userId),
        { permission },
        { withCredentials: true }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Fetch permission audit logs (admin only)
export const fetchAuditLogs = createAsyncThunk(
  "permission/fetchAuditLogs",
  async (
    params: { userId?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(endpoint_permission.getAuditLogs, {
        params,
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
