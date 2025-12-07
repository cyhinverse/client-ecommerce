import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  cleanNotification,
  countUnreadNotification,
  getListNotification,
  markAllAsReadNotification,
  markAsReadNotification,
} from "./notificationAction";
import { Notification, NotificationState } from "@/types/notification";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Actions for Socket updates
    addNotification: (state, action: PayloadAction<Notification>) => {
      const exists = state.notifications.some(n => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
        if (state.pagination) {
          state.pagination.totalItems += 1;
        }
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // =========================== GET LIST NOTIFICATION ===========================
    builder.addCase(getListNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListNotification.fulfilled, (state, action) => {
      state.loading = false;
      const { data, pagination, unreadCount } = action.payload.data;
      state.notifications = data; // data is now the notifications array
      state.pagination = pagination;
      
      // Also sync unread count 
      if (unreadCount !== undefined) {
        state.unreadCount = unreadCount;
      }
    });
    builder.addCase(getListNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch notifications";
    });

    // =========================== MARK AS READ NOTIFICATION ===========================
    builder.addCase(markAsReadNotification.pending, (state) => {
      // Optimistic update could go here, or just loading state
    });
    builder.addCase(markAsReadNotification.fulfilled, (state, action) => {
       // Typically we refresh or update local state
       // Logic to mark local notification as read if needed
    });
    builder.addCase(markAsReadNotification.rejected, (state, action) => {
        // Handle error
    });

    // =========================== MARK ALL AS READ NOTIFICATION ===========================
    builder.addCase(markAllAsReadNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(markAllAsReadNotification.fulfilled, (state) => {
      state.loading = false;
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    });
    builder.addCase(markAllAsReadNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to mark all as read";
    });

    // =========================== CLEAN NOTIFICATION ===========================
    builder.addCase(cleanNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cleanNotification.fulfilled, (state) => {
      state.loading = false;
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination = null;
    });
    builder.addCase(cleanNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to clean notifications";
    });

    // =========================== COUNT UNREAD NOTIFICATION ===========================
    builder.addCase(countUnreadNotification.fulfilled, (state, action) => {
      state.unreadCount = action.payload.data.count;
    });
  },
});

export const {
  addNotification,
  setUnreadCount,
  clearError,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
