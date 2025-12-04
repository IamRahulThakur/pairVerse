import { io } from "socket.io-client";
import { BASEURL } from "./api";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASEURL, {
      withCredentials: true,
    });
  }
  else {
    return io("/", { path: "/socket.io" });
  }
};
