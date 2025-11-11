import express from "express";
import { chatModel } from "../model/chat.js";
import { userAuth } from "../middlewares/auth.js";
import { UserModel } from "../model/user.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    
    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // FIX: Remove $all operator, use direct array check
    let chat = await chatModel.findOne({
      participants: { $all: [userId, targetUserId] }
    }).populate({
      path: "messages.senderId",
      select: "firstName"
    });

    if (!chat) {
      // FIX: Create new chat with proper participants array
      chat = new chatModel({
        participants: [userId, targetUserId], // Remove $all, use direct array
        messages: [],
      });
      await chat.save();
    }

    res.json({
      chat: chat,
      user: targetUser.firstName
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default chatRouter;