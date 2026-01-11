/**
 * User/Profile React Query Hooks
 * Replaces userAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import { userKeys } from "@/lib/queryKeys";
import { User } from "@/types/user";
import { Address } from "@/types/address";
import { PaginationData } from "@/types/common";

// ============ Types ============
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isVerifiedEmail?: boolean;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface CreateAddressData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  addressId: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  roles: string;
  isVerifiedEmail: boolean;
  permissions?: string[];
}

export interface UpdateUserData {
  id: string;
  username: string;
  email: string;
  isVerifiedEmail: boolean;
  roles: string;
  permissions?: string[];
}

// ============ API Functions ============
const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await instance.get("/users/profile");
    return extractApiData(response);
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await instance.get("/users/addresses");
    return extractApiData(response);
  },

  // Admin: Get all users
  getAll: async (
    params: UserListParams = {}
  ): Promise<{ users: User[]; pagination: PaginationData | null }> => {
    const { page = 1, limit = 10, search, role, isVerifiedEmail } = params;
    const response = await instance.get("/users", {
      params: { page, limit, search, role, isVerifiedEmail },
    });
    const data = extractApiData<{ data?: User[]; pagination?: PaginationData }>(
      response
    );
    return {
      users: data?.data || [],
      pagination: data?.pagination || null,
    };
  },

  // Mutations
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await instance.put("/users/profile", data);
    return extractApiData(response);
  },

  uploadAvatar: async (formData: FormData): Promise<{ avatar: string }> => {
    const response = await instance.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(response);
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await instance.post("/users/change-password", data);
  },

  // Address mutations
  createAddress: async (data: CreateAddressData): Promise<Address> => {
    const response = await instance.post("/users/address", data);
    return extractApiData(response);
  },

  updateAddress: async (data: UpdateAddressData): Promise<Address> => {
    const { addressId, ...updateData } = data;
    const response = await instance.put(
      `/users/address/${addressId}`,
      updateData
    );
    return extractApiData(response);
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await instance.delete(`/users/address/${addressId}`);
  },

  setDefaultAddress: async (addressId: string): Promise<Address[]> => {
    const response = await instance.put(`/users/address/${addressId}/default`);
    return extractApiData(response);
  },

  // Admin mutations
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await instance.post("/users/create", data);
    return extractApiData(response);
  },

  updateUser: async (data: UpdateUserData): Promise<User> => {
    const response = await instance.post("/users/update", data);
    return extractApiData(response);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await instance.delete(`/users/${userId}`);
  },
};

// ============ Query Hooks ============

/**
 * Get current user profile
 */
export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userApi.getProfile,
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get user addresses
 */
export function useAddresses(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.addresses(),
    queryFn: userApi.getAddresses,
    enabled: options?.enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - addresses don't change often
  });
}

/**
 * Get all users (Admin)
 */
export function useAllUsers(params?: UserListParams) {
  return useQuery({
    queryKey: [...userKeys.all, "list", params] as const,
    queryFn: () => userApi.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
}

// ============ Profile Mutation Hooks ============

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.profile(), data);
    },
    onError: (error) => {
      console.error("Update profile failed:", extractApiError(error));
    },
  });
}

/**
 * Upload avatar mutation
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error("Upload avatar failed:", extractApiError(error));
    },
  });
}

/**
 * Change password mutation
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: userApi.changePassword,
    onError: (error) => {
      console.error("Change password failed:", extractApiError(error));
    },
  });
}

// ============ Address Mutation Hooks ============

/**
 * Create address mutation
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error("Create address failed:", extractApiError(error));
    },
  });
}

/**
 * Update address mutation
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error("Update address failed:", extractApiError(error));
    },
  });
}

/**
 * Delete address mutation
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error("Delete address failed:", extractApiError(error));
    },
  });
}

/**
 * Set default address mutation
 */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.setDefaultAddress,
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.addresses(), data);
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error("Set default address failed:", extractApiError(error));
    },
  });
}

// ============ Admin User Mutation Hooks ============

/**
 * Create user mutation (Admin)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error("Create user failed:", extractApiError(error));
    },
  });
}

/**
 * Update user mutation (Admin)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error("Update user failed:", extractApiError(error));
    },
  });
}

/**
 * Delete user mutation (Admin)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error("Delete user failed:", extractApiError(error));
    },
  });
}
