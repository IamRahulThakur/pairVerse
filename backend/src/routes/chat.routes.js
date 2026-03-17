import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";

import { chatHandler } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, chatHandler);

export default chatRouter;
