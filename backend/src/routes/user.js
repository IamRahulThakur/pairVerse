import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequestModel } from "../model/connectionRequest.js";
import { UserModel } from "../model/user.js";
import { notificationModel } from "../model/notifications.js";
import { PostModel } from "../model/post.js";
import { uploadPost } from "../middlewares/uploadPost.js";
import redis from "../config/redis.js"


const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "username",
  "gender",
  "photourl",
  "techStack",
  "experienceLevel",
  "linkedIn",
  "Github",
];

// Get all pending Request for User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // Isme hame bas vo data bejna hai jo where toUserId
    // is req.userId
    const data = await ConnectionRequestModel.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName  photourl domain");

    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Connection List
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {

     const key = `connections:${req.user._id}`;

    // 1. Try cache
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));


    // DB se vo id nikalni hai jisme toUserId login person
    // ki userId hai and status accepted hai
    const connectionData = await ConnectionRequestModel.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    const data = connectionData.map((row) => {
      if (row.toUserId._id.toString() === req.user._id.toString()) {
        return row.fromUserId;
      } else {
        return row.toUserId;
      }
    });
    await redis.set(key, JSON.stringify(data), "EX", 100);
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Notification of Users
userRouter.get("/user/notifications", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Return all notifications (read and unread) sorted by newest first
    const notifications = await notificationModel
      .find({
        toUserId: req.user._id,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Return full notification objects
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Mark Notification Read when user open Particular Notification
userRouter.patch(
  "/user/notification/:notificationId/mark-read",
  userAuth,
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        return res.status(400).json({ error: "Notification ID is required" });
      }

      const notification = await notificationModel.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      // Check if current user owns this notification
      if (notification.toUserId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ error: "Not authorized to access this notification" });
      }

      if (notification.status === "read") {
        return res
          .status(200)
          .json({ message: "Notification already marked as read" });
      }

      notification.status = "read";
      await notification.save();

      res
        .status(200)
        .json({ message: "Notification status updated", notification });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.patch(
  "/user/notifications/mark-all-read",
  userAuth,
  async (req, res) => {
    try {
      const notifications = await notificationModel.find({
        toUserId: req.user._id,
        status: "unread",
      });

      if (notifications.length === 0) {
        return res.status(200).json({ message: "No unread Notifications" });
      }

      await notificationModel.updateMany(
        { toUserId: req.user._id, status: "unread" },
        { $set: { status: "read" } }
      );

      res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// User creates a Post (text + media)
userRouter.post(
  "/user/posts/create",
  userAuth,
  uploadPost.array("media", 5), // allows up to 5 files
  async (req, res) => {
    try {
      const user = req.user;
      const { title, content } = req.body;

      // Ensure there’s at least text or media
      if (!title && !content && (!req.files || req.files.length === 0)) {
        return res
          .status(400)
          .json({ error: "Post must have text, media, or both" });
      }

      // Collect uploaded media info
      const media = req.files?.map((file) => ({
        url: file.path, // Cloudinary URL
        type: file.mimetype.startsWith("video") ? "video" : "image",
        public_id: file.filename, // needed if you later want to delete media
      })) || [];

      // Create new post
      const newPost = new PostModel({
        title,
        content,
        userId: user._id,
        media,
      });

      await newPost.save();

      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// User delete his post
userRouter.delete("/user/posts/delete/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("Deleting post:", postId);

    if (!postId) {
      return res.status(400).send({ error: "Post ID is required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "You are not authorized to delete this post" });
    }

    // Delete all media from Cloudinary
    if (post.media && post.media.length > 0) {
      console.log("Deleting media files:", post.media);
      for (const item of post.media) {
        if (item.public_id) {
          try {
            await cloudinary.uploader.destroy(item.public_id);
            console.log("Deleted media from Cloudinary:", item.public_id);
          } catch (cloudinaryError) {
            console.error("Cloudinary deletion error:", cloudinaryError);
            // Continue with post deletion even if Cloudinary fails
          }
        }
      }
    }

    await PostModel.findByIdAndDelete(postId);
    console.log("Post deleted successfully from database");
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Generating feed for User
userRouter.get("/user/posts/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const connectionData = await ConnectionRequestModel.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    });
    const data = connectionData.map((row) => {
      if (row.toUserId._id.toString() === req.user._id.toString()) {
        return row.fromUserId;
      } else {
        return row.toUserId;
      }
    });

    const feedData = await PostModel.find({
      userId: {
        $in: data.map((user) => user._id),
      },
    })
      .populate("userId", USER_SAFE_DATA)
      .select("content media likes commentsCount createdAt userId")
      .sort({ createdAt: -1 });

    res.status(200).send(feedData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/user/posts", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const feedData = await PostModel.find({ userId: userId })
      .populate("userId", USER_SAFE_DATA)
      .select("content media likes commentsCount createdAt visibility")
      .sort({ createdAt: -1 });

    res.send(feedData);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

userRouter.get("/user/matchingpeers", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current user
    const baseUser = await UserModel.findById(userId).lean();
    if (!baseUser || !baseUser.techStack) {
      return res.status(404).send({ error: "User not found or no tech stack available" });
    }

    const userTechStack = baseUser.techStack;

    // Get all users who already have a connection request with this user
    const existingConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    }).lean();

    // Collect IDs of users that should be excluded
    const excludeUserIds = existingConnections.map(conn =>
      conn.fromUserId.toString() === userId.toString()
        ? conn.toUserId
        : conn.fromUserId
    );

    // Aggregation for matching users
    const matches = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $ne: baseUser._id,
            $nin: excludeUserIds
          },
        },
      },
      {
        $addFields: {
          commonTechs: { $setIntersection: ["$techStack", userTechStack] },
        },
      },
      {
        $addFields: {
          matchCount: { $size: "$commonTechs" },
        },
      },
      {
        $match: { matchCount: { $gt: 0 } },
      },
      {
        $sort: { matchCount: -1 },
      },
      {
        $project: {
          photourl: 1,
          firstName: 1,
          lastName: 1,
          techStack: 1,
          commonTechs: 1,
          matchCount: 1,
        },
      },
    ]);

    res.json(matches);
  } catch (err) {
    console.error("Error in findfriends:", err);
    res.status(500).send({ error: err.message });
  }
});

userRouter.get("/search/:username", userAuth, async (req, res) => {
  try {
    const { username } = req.params;

    if (username == req.user.username) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(username, 'i');

    const users = await UserModel.find({
      username: { $regex: regex }
    }).select(USER_SAFE_DATA);



    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;
