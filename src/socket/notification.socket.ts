import { Socket } from "socket.io-client";
import { AppDispatch } from "@/store/configStore";
import { addNotification, setUnreadCount } from "@/features/notification/notificationSlice";
import { toast } from "sonner";

export const handleNotificationEvents = (socket: Socket, dispatch: AppDispatch) => {
  if (!socket) return;

  socket.on("new_notification", (notification) => {
    console.log("🔥 [Socket] New notification received:", notification);
    toast.message(notification.title, {
      description: notification.message,
    });
    dispatch(addNotification(notification));
  });

  socket.on("unread_count", (count) => {
    console.log("🔥 [Socket] Unread count update:", count);
    dispatch(setUnreadCount(count));
  });
};
