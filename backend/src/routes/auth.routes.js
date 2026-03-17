import express from "express";

import { userAuth } from "../middlewares/auth.middleware.js";
import { loginHandler, logoutHandler, signupHandler } from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/signup", signupHandler);

authRouter.post("/login", loginHandler);

authRouter.post("/logout", userAuth , logoutHandler);

export default authRouter;
