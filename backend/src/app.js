import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js"
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import { startCleanNotifications } from "./cron/notificationCleanup.js";
import cors from 'cors'


export const app = express();

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
 

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => console.log("Server running"));
    startCleanNotifications();

  })
  .catch(err => {
    console.error("DB connection error:", err);
  });

