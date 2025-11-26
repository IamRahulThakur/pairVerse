import { Server } from "socket.io";
import crypto from "crypto";
import { chatModel } from "../model/chat.js";
import { timeStamp } from "console";

const getHashedRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
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
            console.log(firstName + " " + text);

            try {
                let chat = await chatModel.findOne({
                    participants: { $all: [userId, targetUserId] },
                });

                if (!chat) {
                    chat = new chatModel({
                    participants: [userId, targetUserId],
                    messages: [],
                    });
                }

                // Push the new message
                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                const newMessage = chat.messages[chat.messages.length - 1];

                io.to(roomId).emit("messageReceived", {
                    firstName,
                    text: newMessage.text,
                    senderId: newMessage.senderId,
                    timestamp: newMessage.createdAt,
                });
            } catch (error) {
            console.log(error.message);
            }
      }
    );

    socket.on("disconnect", () => {});
  });
};

export default initialiseSocket;
