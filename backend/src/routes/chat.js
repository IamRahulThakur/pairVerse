import express from "express";
import { chatModel } from "../model/chat.js";
import { userAuth } from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await chatModel.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
        path: "messages.senderId",
        select: "firstName"
    });

    if (!chat) {
      chat = new chatModel({
        participants: { $all: [userId, targetUserId] },
        messages: [],
      });
    }

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.send(error.message);
  }
});

export default chatRouter;
