// socket.js
import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_BACKEND_URL_WS}`, {
  transports: ["websocket"],
  autoConnect: true,
});
