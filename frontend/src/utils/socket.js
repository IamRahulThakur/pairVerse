import { io } from "socket.io-client";
import { BASEURL } from "./api";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
      path: "/socket.io"
    });
  }

  return io("/", {
    transports: ["websocket"],
    withCredentials: true,
    path: "/socket.io"
  });
};
