import express from "express";
import { userAuth } from "../middlewares/auth.js";

import { chatHandler } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, chatHandler);

export default chatRouter;