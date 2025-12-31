import { Socket } from "socket.io-client";
import { AppDispatch } from "@/store/configStore";
import {
  addNotification,
  setUnreadCount,
} from "@/features/notification/notificationSlice";
import { toast } from "sonner";

export const handleNotificationEvents = (
  socket: Socket,
  dispatch: AppDispatch
) => {
  if (!socket) return;

  socket.on("new_notification", (notification) => {
    // Defensive check: Ensure title/message are strings
    const title =
      typeof notification.title === "string"
        ? notification.title
        : "Notification";
    const message =
      typeof notification.message === "string" ? notification.message : "";

    toast.message(title, {
      description: message,
    });
    dispatch(addNotification(notification));
  });

  socket.on("unread_count", (count) => {
    dispatch(setUnreadCount(count));
  });
};
