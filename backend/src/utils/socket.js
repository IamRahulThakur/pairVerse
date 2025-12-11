import { Server } from "socket.io";
import crypto from "crypto";
import { chatModel } from "../model/chat.js";
import { timeStamp } from "console";
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
      origin: "*",
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    // Handle Events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getHashedRoomId(userId, targetUserId);
      console.log("Joining Room  " + roomId);
      socket.join(roomId);
    });

    // Here server is listening to sendMessage and whenever msg comes inside sendMessage event it is sending that message to that room ans then it emit event messageReceived with message so frontend code listen to that event
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        const roomId = getHashedRoomId(userId, targetUserId);

        try {
          let newMessage = await sendMessageService(userId, targetUserId, text);

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
      }
    );

    socket.on("disconnect", () => {});
  });
};

export default initialiseSocket;
