"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { initSocketEvents } from "@/socket/index";
import { SocketContextType } from "@/types/socket";

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Create socket connection
    const socketUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!socketUrl) {
      console.warn("NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Initialize events (listen for notifications)
    initSocketEvents(socketInstance, queryClient, dispatch);

    // Save socket to state
    setSocket(socketInstance);

    // Cleanup on unmount or auth change
    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, queryClient, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
