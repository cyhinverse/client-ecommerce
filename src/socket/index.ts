import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { handleNotificationEvents } from "./notification.socket";
import { handleChatEvents } from "./chat.socket";
import { AppDispatch } from "@/store/configStore";

export const initSocketEvents = (
  socket: Socket,
  queryClient: QueryClient,
  dispatch: AppDispatch
) => {
  handleNotificationEvents(socket, queryClient);
  handleChatEvents(socket, dispatch);
};
