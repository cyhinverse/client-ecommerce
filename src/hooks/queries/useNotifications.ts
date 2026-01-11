/**
 * Notification React Query Hooks
 * Replaces notificationAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import { notificationKeys } from "@/lib/queryKeys";
import { Notification } from "@/types/notification";
import { PaginationData } from "@/types/common";

// ============ Types ============
export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: string;
  isRead?: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: PaginationData | null;
  unreadCount?: number;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: string;
  userId?: string;
  link?: string;
  orderId?: string;
}

// ============ API Functions ============
const notificationApi = {
  getList: async (
    params: NotificationListParams = {}
  ): Promise<NotificationListResponse> => {
    const { page = 1, limit = 10 } = params;
    const response = await instance.get("/notifications", {
      params: { page, limit },
    });
    const data = extractApiData<
      NotificationListResponse & {
        data?: Notification[];
        metadata?: { unreadCount?: number };
        meta?: { unreadCount?: number };
      }
    >(response);
    // Handle both old format (meta) and new format (metadata)
    const unreadCount =
      data?.metadata?.unreadCount ?? data?.meta?.unreadCount ?? 0;
    return {
      notifications: data?.notifications || data?.data || [],
      pagination: data?.pagination || null,
      unreadCount,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await instance.get("/notifications/count");
    const data = extractApiData<{ count?: number }>(response);
    return data?.count || 0;
  },

  // Mutations
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await instance.patch(`/notifications/${notificationId}`, {
      isRead: true,
    });
    return extractApiData(response);
  },

  markAllAsRead: async (): Promise<void> => {
    await instance.patch("/notifications/read-all", {});
  },

  delete: async (notificationId: string): Promise<void> => {
    await instance.delete(`/notifications/${notificationId}`);
  },

  clearAll: async (): Promise<void> => {
    await instance.delete("/notifications");
  },

  // Admin: Create notification
  create: async (data: CreateNotificationData): Promise<Notification> => {
    const response = await instance.post("/notifications", data);
    return extractApiData(response);
  },
};

// ============ Query Hooks ============

/**
 * Get notifications list
 */
export function useNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getList(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get unread notification count (for badge)
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationApi.getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Poll every minute
  });
}

// ============ Mutation Hooks ============

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      console.error("Mark as read failed:", extractApiError(error));
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      console.error("Mark all as read failed:", extractApiError(error));
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      console.error("Delete notification failed:", extractApiError(error));
    },
  });
}

/**
 * Clear all notifications
 */
export function useClearAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.clearAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      console.error("Clear all notifications failed:", extractApiError(error));
    },
  });
}

/**
 * Create notification (Admin)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      console.error("Create notification failed:", extractApiError(error));
    },
  });
}

/**
 * Hook to invalidate notifications from socket events
 * Call this when receiving a new notification via socket
 */
export function useInvalidateNotifications() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  };
}
