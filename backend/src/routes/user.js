import express from "express";
import { userAuth } from "../middlewares/auth.js";

import { uploadPost } from "../middlewares/uploadPost.js";
import {
  createPostHandler,
  deletePostHandler,
  generateFeedHandler,
  getConnectionHandler,
  findMatchingPeersHandler,
  getNotificationsHandler,
  getRequestHandler,
  getUserPostsHandler,
  markAllNotificationsAsReadHandler,
  markNotificationAsReadHandler,
  searchUsersHandler,
} from "../controllers/userController.js";

const userRouter = express.Router();



// Get all pending Request for User
userRouter.get("/user/requests/received", userAuth, getRequestHandler);

// Get Connection List
userRouter.get("/user/connections", userAuth, getConnectionHandler);

// Get Notification of Users
userRouter.get("/user/notifications", userAuth, getNotificationsHandler);

// Mark Notification Read when user open Particular Notification
userRouter.patch(
  "/user/notification/:notificationId/mark-read",
  userAuth,
  markNotificationAsReadHandler
);

userRouter.patch(
  "/user/notifications/mark-all-read",
  userAuth,
  markAllNotificationsAsReadHandler
);

// User creates a Post (text + media)
userRouter.post(
  "/user/posts/create",
  userAuth,
  uploadPost.array("media", 5), // allows up to 5 files
  createPostHandler
);

// User delete his post
userRouter.delete("/user/posts/delete/:postId", userAuth, deletePostHandler);

// Generating feed for User
userRouter.get("/user/posts/feed", userAuth, generateFeedHandler);

// Get all posts by a specific user
userRouter.get("/user/posts", userAuth, getUserPostsHandler);

// Get Matching Peers
userRouter.get("/user/matchingpeers", userAuth, findMatchingPeersHandler);

// Search User by username
userRouter.get("/search/:username", userAuth, searchUsersHandler);

export default userRouter;
