import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import multer from "multer";

import connectDB from "./config/database.js";
import initialiseSocket from "./utils/socket.js";
import { startCleanNotifications } from "./cron/notificationCleanup.js";

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";

import { BadRequestError } from "./utils/appError.js";

export const app = express();


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

// Handle Multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new BadRequestError("File size must be under 10MB"));
    }
    return next(new BadRequestError(err.message));
  }

  if (
    err?.message === "Only image files are allowed" ||
    err?.message === "Only image or video files are allowed"
  ) {
    return next(new BadRequestError(err.message));
  }

  next(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (statusCode === 500) {
    console.error("SERVER ERROR :", err);
  }

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Something went very wrong! Please try again later.",
  });
});


const server = http.createServer(app);
initialiseSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(3000, () => console.log("Server running on port 3000"));
    startCleanNotifications();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
