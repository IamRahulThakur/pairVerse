import { chatModel } from "../model/chat.js";
import { UserModel } from "../model/user.js";
import { NotFoundError } from "../utils/appError.js";

export const chatService = async (userId, targetUserId) => {
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new NotFoundError("Target user not found");
  }

  let chat = await chatModel
    .findOne({
      participants: { $all: [userId, targetUserId] },
    })
    .populate({
      path: "messages.senderId",
      select: "firstName",
    });

  if (!chat) {
    chat = new chatModel({
      participants: [userId, targetUserId],
      messages: [],
    });
    await chat.save();
  }

  return { chat, targetUser };
};

export const sendMessageService = async (senderId, targetUserId, text) => {
  let chat = await chatModel.findOne({
    participants: { $all: [senderId, targetUserId] },
  });

  if (!chat) {
    chat = new chatModel({
      participants: [senderId, targetUserId],
      messages: [],
    });
  }

  chat.messages.push({
    senderId,
    text,
  });

  await chat.save();

  const newMessage = chat.messages[chat.messages.length - 1];

  return newMessage;
};
