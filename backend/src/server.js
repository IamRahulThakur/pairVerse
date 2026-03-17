import "./config/env.js";
import http from "http";

import { app } from "./app.js";
import connectDB from "./config/database.js";
import { startCleanNotifications } from "./cron/notificationCleanup.js";
import initialiseSocket from "./realtime/socket.server.js";

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
