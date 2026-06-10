import { io } from "socket.io-client";

const SOCKET_URL =
  "https://real-time-chat-app-backend-x5x1.onrender.com";

export const socket = io(
  SOCKET_URL,
  {
    autoConnect: false,
  }
);