import { Server } from "socket.io";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { sendMessageService } from "../services/chatService.js";

const getHashedRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://pairverse.onrender.com"
          : "http://localhost:5173",
      credentials: true,
    },
    path: "/socket.io",
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("No cookies found"));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) {
        return next(new Error("No auth token"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.userId;

      next();
    } catch (err) {
      next(new Error("Unauthorized socket"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", ({ targetUserId }) => {
      const roomId = getHashedRoomId(
        socket.userId,
        targetUserId
      );

      socket.join(roomId);

      console.log("Joined room:", roomId);
    });

    socket.on("sendMessage", async ({ targetUserId, text, firstName }) => {
      const roomId = getHashedRoomId(
        socket.userId,
        targetUserId
      );

      try {
        const newMessage = await sendMessageService(
          socket.userId,
          targetUserId,
          text
        );

        io.to(roomId).emit("messageReceived", {
          firstName,
          text: newMessage.text,
          senderId: newMessage.senderId,
          timestamp: newMessage.createdAt,
        });
      } catch (error) {
        socket.emit("messageFailed", {
          error: error.message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default initialiseSocket;
