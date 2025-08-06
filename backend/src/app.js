import express from "express";
import connectDB from "./config/database.js";
import { UserModel } from "./model/user.js";
import { validateSignupData } from "./utils/validation.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js"
import requestRouter from "./routes/request.js";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter)

// Connecting to DB Before Starting Server
connectDB() .then(() => {
    console.log("Database connected successfully");
    // Start the server after successful database connection
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
