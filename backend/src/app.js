import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js"
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import { startCleanNotifications } from "./cron/notificationCleanup.js";
import cors from 'cors'
import http from 'http'
import initialiseSocket from "./utils/socket.js";
import chatRouter from "./routes/chat.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const app = express();

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));
app.use(express.json()); 
app.use(cookieParser());


app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.set('trust proxy', 1);

app.use(limiter);

app.use('/api', authRouter);
app.use('/api', profileRouter);
app.use('/api', requestRouter);
app.use('/api', userRouter);
app.use('/api', chatRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const server = http.createServer(app);
initialiseSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(3000, () => console.log("Server running"));
    startCleanNotifications();

  })
  .catch(err => {
    console.error("DB connection error:", err);
  });

