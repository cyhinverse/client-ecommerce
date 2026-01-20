import { Socket } from "socket.io-client";
import { AppDispatch } from "@/store/configStore";
import { addMessage } from "@/features/chat/chatSlice";
import { Message } from "@/types/chat";

/**
 * Sets up chat event listeners on the socket connection.
 * Listens for new_message events and dispatches addMessage action.
 *
 * @param socket - The socket.io client socket instance
 * @param dispatch - The Redux store dispatch function
 *
 */
export const handleChatEvents = (
  socket: Socket,
  dispatch: AppDispatch,
): void => {
  if (!socket) return;

  socket.on("new_message", (message: Message) => {
    dispatch(addMessage(message));
  });
};

/**
 * Joins a conversation room to receive real-time messages.
 * Emits join_conversation event to the server.
 *
 * @param socket - The socket.io client socket instance
 * @param conversationId - The ID of the conversation to join
 *
 */
export const joinConversation = (
  socket: Socket,
  conversationId: string,
): void => {
  if (!socket || !conversationId) return;

  socket.emit("join_conversation", conversationId);
};

/**
 * Leaves a conversation room to stop receiving real-time messages.
 * Emits leave_conversation event to the server.
 *
 * @param socket - The socket.io client socket instance
 * @param conversationId - The ID of the conversation to leave
 *
 */
export const leaveConversation = (
  socket: Socket,
  conversationId: string,
): void => {
  if (!socket || !conversationId) return;

  socket.emit("leave_conversation", conversationId);
};
