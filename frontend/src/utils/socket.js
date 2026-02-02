import { io } from "socket.io-client";

export const createSocketConnection = () => {
  const SOCKET_URL =
    location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://pairverse-backed.onrender.com";

  return io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
    path: "/socket.io",
  });
};
