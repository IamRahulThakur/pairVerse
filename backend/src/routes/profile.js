import express from "express";
import { userAuth } from "../middlewares/auth.js";

import {upload} from "../middlewares/multer.js";
import { editProfileHandler, getProfileHandler, getUserProfileByIdHandler, updatePasswordHandler } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, getProfileHandler);

profileRouter.patch( "/profile/edit", userAuth, upload.single("photo"),editProfileHandler);

profileRouter.patch("/profile/updatePassword", userAuth, updatePasswordHandler);

profileRouter.get("/profile/:userId", userAuth, getUserProfileByIdHandler);

export default profileRouter;
