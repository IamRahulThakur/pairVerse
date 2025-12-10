import { chatModel } from "../model/chat.js";
import { UserModel } from "../model/user.js";
import { NotFoundError } from "../utils/appError.js";

export const chatService = async (userId, targetUserId) => {
    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
        throw new NotFoundError("Target user not found");
    }

    let chat = await chatModel.findOne({
      participants: { $all: [userId, targetUserId] }
    }).populate({
      path: "messages.senderId",
      select: "firstName"
    });

    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    return { chat, targetUser };
}