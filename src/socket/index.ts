import { Socket } from "socket.io-client";
import { AppDispatch } from "@/store/configStore";
import { handleNotificationEvents } from "./notification.socket";

export const initSocketEvents = (socket: Socket, dispatch: AppDispatch) => {
  handleNotificationEvents(socket, dispatch);
};
