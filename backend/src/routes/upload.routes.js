import express from "express";

import { uploadImageHandler } from "../controllers/upload.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload/image", userAuth, uploadImage.single("image"), uploadImageHandler);

export default uploadRouter;
