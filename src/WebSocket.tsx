// socket.js
import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_SOCKET_URL_DOC}`, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: false,
});

// Add global error handling
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error.message);
});

socket.on("reconnect_failed", () => {
  console.error("Socket reconnection failed after maximum attempts");
});

// Add global handlers for presence events
socket.on("userPresenceUpdate", (data) => {
  console.log("User presence updated:", data);
});

socket.on("cursorPositionUpdate", (data) => {
  console.log("Cursor position updated:", data);
});
