import { io } from "socket.io-client"
import {BASEURL}from "./api"

export const createSocketConnection = () => {
    return io(BASEURL, {
        withCredentials: true,
    });
}