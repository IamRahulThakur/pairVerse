import { ConnectionRequestModel } from "../model/connectionRequest.js";
import { UserModel } from "../model/user.js";
import { notificationModel } from "../model/notifications.js";
import { PostModel } from "../model/post.js";
import redis from "../config/redis.js";
import { BadRequestError, ConflictError, NotFoundError, UnauthorisedError } from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";


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
  "domain"
];

export const getRequestService = async (userId) => {
  const data = await ConnectionRequestModel.find({
    toUserId: userId,
    status: "interested",
  }).populate("fromUserId", "firstName lastName  photourl domain");
  return data;
};

export const getConnectionService = async (userId) => {
  const key = `connections:${userId}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const connectionData = await ConnectionRequestModel.find({
    $or: [
      { toUserId: userId, status: "accepted" },
      { fromUserId: userId, status: "accepted" },
    ],
  })
    .populate("toUserId", USER_SAFE_DATA)
    .populate("fromUserId", USER_SAFE_DATA);

  const data = connectionData.map((row) => {
    if (row.toUserId._id.toString() === userId.toString()) {
      return row.fromUserId;
    } else {
      return row.toUserId;
    }
  });
  await redis.set(key, JSON.stringify(data), "EX", 100);
  return data;
};

export const getNotificationsService = async (page, limit, userId) => {
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const notifications = await notificationModel
    .find({
      toUserId: userId,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return notifications;
};

export const markNotificationAsReadService = async (notificationId, userId) => {
  if (!notificationId) {
    throw new BadRequestError("Notification ID is required");
  }

  const notification = await notificationModel.findById(notificationId);

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  if (notification.toUserId.toString() !== userId.toString()) {
    throw new UnauthorisedError("Not authorized to access this notification");
  }

  if (notification.status === "read") {
    throw new BadRequestError("Notification already marked as read");
  }

  notification.status = "read";
  await notification.save();

  return notification;
};

export const markAllNotificationsAsReadService = async (userId) => {
  const notifications = await notificationModel.find({
    toUserId: userId,
    status: "unread",
  });

  if (notifications.length === 0) {
    return;
  }

  await notificationModel.updateMany(
    { toUserId: userId, status: "unread" },
    { $set: { status: "read" } }
  );
};

export const createPostService = async (user, title, content, reqFiles) => {
  if (!title && !content && (!reqFiles || reqFiles.length === 0)) {
    throw new Error("Post must have text, media, or both");
  }

  const media =
    reqFiles?.map((file) => ({
      url: file.path,
      type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: file.filename,
    })) || [];

  const newPost = new PostModel({
    title,
    content,
    userId: user._id,
    media,
  });

  const userConnection = await ConnectionRequestModel.find({
    $or: [
      { toUserId: user._id, status: "accepted" },
      { fromUserId: user._id, status: "accepted" },
    ],
  });

  const connectionIds = userConnection.map((conn) =>
    conn.toUserId.toString() === user._id.toString()
      ? conn.fromUserId
      : conn.toUserId
  );

  const idsToInvalidate = [...connectionIds, userId.toString()];

  const redisKeys = idsToInvalidate.map(id => `feed:${id}`);

  if (redisKeys.length > 0) {
      await redis.del(...redisKeys); 
  }

  await newPost.save();
  return newPost;
};

export const deletePostService = async (postId, userId) => {
  if (!postId) {
    throw new ConflictError("Post ID is required");
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.userId.toString() !== userId.toString()) {
    throw new UnauthorisedError("You are not authorized to delete this post");
  }
  // Delete all media from Cloudinary
  if (post.media && post.media.length > 0) {
    console.log("Deleting media files:", post.media);
    for (const item of post.media) {
      if (item.public_id) {
        try {
          await cloudinary.uploader.destroy(item.public_id);
        } catch (cloudinaryError) {}
      }
    }
  }

  await PostModel.findByIdAndDelete(postId);
    const userConnection = await ConnectionRequestModel.find({
    $or: [
      { toUserId: user._id, status: "accepted" },
      { fromUserId: user._id, status: "accepted" },
    ],
  });

  const connectionIds = userConnection.map((conn) =>
    conn.toUserId.toString() === user._id.toString()
      ? conn.fromUserId
      : conn.toUserId
  );

  const idsToInvalidate = [...connectionIds, userId.toString()];

  const redisKeys = idsToInvalidate.map(id => `feed:${id}`);

  if (redisKeys.length > 0) {
      await redis.del(...redisKeys); 
  }
};

export const generateFeedService = async (user) => {
  if (!user) {
    throw new UnauthorisedError("Unauthorized");
  }
  const key = `feed:${user._id}`;
  
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const connectionData = await ConnectionRequestModel.find({
    $or: [
      { toUserId: user._id, status: "accepted" },
      { fromUserId: user._id, status: "accepted" },
    ],
  });

  const data = connectionData.map((row) => {
    if (row.toUserId.toString() === user._id.toString()) {
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

  await redis.set(key, JSON.stringify(feedData), "EX", 120);
  return feedData;
};

export const getUserPostsService = async (userId) => {
  const feedData = await PostModel.find({ userId: userId })
    .populate("userId", USER_SAFE_DATA)
    .select("content media likes commentsCount createdAt visibility")
    .sort({ createdAt: -1 });

  return feedData;
};

export const findMatchingPeersService = async (userId) => {
  // Get current user
  const baseUser = await UserModel.findById(userId).lean();
  if (!baseUser || !baseUser.techStack) {
    throw new NotFoundError("User not found or tech stack is empty");
  }

  const key = `matchingPeers:${userId}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const userTechStack = baseUser.techStack;

  // Get all users who already have a connection request with this user
  const existingConnections = await ConnectionRequestModel.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  }).lean();

  // Collect IDs of users that should be excluded
  const excludeUserIds = existingConnections.map((conn) =>
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
          $nin: excludeUserIds,
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

  await redis.set(key, JSON.stringify(matches), "EX", 300);

  return matches;
};

export const searchUsersService = async (username, currentUsername) => {
  if (username == currentUsername) {
    return [];
  }

  const regex = new RegExp(username, "i");

  const users = await UserModel.find({
    username: { $regex: regex },
  }).select(USER_SAFE_DATA);

  return users;
};
