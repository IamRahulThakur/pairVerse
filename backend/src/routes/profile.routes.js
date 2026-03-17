import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";

import { uploadImage } from "../middlewares/upload.middleware.js";
import { editProfileHandler, getProfileHandler, getUserProfileByIdHandler, updatePasswordHandler } from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, getProfileHandler);

profileRouter.patch(
  "/profile/edit",
  userAuth,
  uploadImage.single("photo"),
  editProfileHandler
);

profileRouter.patch("/profile/updatePassword", userAuth, updatePasswordHandler);

profileRouter.get("/profile/:userId", userAuth, getUserProfileByIdHandler);

export default profileRouter;
