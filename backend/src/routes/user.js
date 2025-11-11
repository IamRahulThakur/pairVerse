import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequestModel } from "../model/connectionRequest.js";
import { UserModel } from "../model/user.js";
import { notificationModel } from "../model/notifications.js";
import { PostModel } from "../model/post.js";

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

    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Notification of Users
userRouter.get("/user/notifications", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 2;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;
    // Whenever user click He sees all Notification whose
    // Status are unread we display only Notifiation Title
    const notifications = await notificationModel
      .find({
        toUserId: req.user._id,
        status: "unread",
      })
      .skip(skip)
      .limit(limit);

    if (notifications.length === 0) {
      return res.status(200).send("No unread notifications");
    }

    res.send(notifications.map((notification) => notification.title));
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

// User Create a Post on plateform
userRouter.post("/user/posts/create", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send({ error: "Title and content are required" });
    }

    const newPost = new PostModel({
      title,
      content,
      userId: user._id,
    });

    await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// User delete his post
userRouter.delete("/user/posts/delete/:postId", userAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      res.status(400).send({ error: "Post ID is required" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).send({ error: "Post not found" });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "You are not authorized to delete this post" });
    }

    await PostModel.findByIdAndDelete(postId);
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
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
      .sort({ createdAt: -1 });

    res.send(feedData);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

userRouter.get("/user/matchingpeers", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Get current user
    const baseUser = await UserModel.findById(userId).lean();
    if (!baseUser || !baseUser.techStack) {
      return res.status(404).send({ error: "User not found or no tech stack available" });
    }

    const userTechStack = baseUser.techStack;

    // Step 2: Get all users who already have a connection request with this user
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

    // Step 3: Aggregation for matching users
    const matches = await UserModel.aggregate([
      {
        $match: {
          _id: { 
            $ne: baseUser._id,           // exclude self
            $nin: excludeUserIds        // exclude existing/pending connections
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
    
    if(username == req.user.username){
      return res.status(200).json([]);
    }

    const regex = new RegExp(username, 'i'); // Case-insensitive search
    
    const users = await UserModel.find({
      username: { $regex: regex }
    }).select(USER_SAFE_DATA);



    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }     
});

export default userRouter;
