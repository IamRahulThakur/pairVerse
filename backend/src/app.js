import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import requestRouter from "./routes/request.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import {
  handleApplicationErrors,
  handleMulterErrors,
} from "./middlewares/error-handler.middleware.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",           
  "https://pairverse.onrender.com"   
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(helmet());
app.use(cookieParser());
app.use(hpp());

app.set("trust proxy", 1);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", uploadRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

// Handle Multer errors
app.use(handleMulterErrors);
app.use(handleApplicationErrors);
