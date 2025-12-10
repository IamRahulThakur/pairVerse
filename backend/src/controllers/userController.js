import {
  createPostService,
  deletePostService,
  findMatchingPeersService,
  generateFeedService,
  getConnectionService,
  getNotificationsService,
  getRequestService,
  getUserPostsService,
  markAllNotificationsAsReadService,
  markNotificationAsReadService,
  searchUsersService,
} from "../services/userService.js";

export const getRequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await getRequestService(userId);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

export const getConnectionHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await getConnectionService(userId);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

export const getNotificationsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id;

    const notifications = await getNotificationsService(page, limit, userId);

    res.send(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadHandler = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await markNotificationAsReadService(
      notificationId,
      userId
    );

    res
      .status(200)
      .json({ message: "Notification status updated", notification });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsReadHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await markAllNotificationsAsReadService(userId);

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error)
  }
};

export const createPostHandler = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, content } = req.body;
    const reqFiles = req.files;

    const newPost = await createPostService(user, title, content, reqFiles);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(error)
  }
};

export const deletePostHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    await deletePostService(postId, userId);

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    next(error)
  }
};

export const generateFeedHandler = async (req, res, next) => {
  try {
    const user = req.user;

    const feedData = await generateFeedService(user);

    res.status(200).send(feedData);
  } catch (error) {
    next(error);
  }
};

export const getUserPostsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const feedData = await getUserPostsService(userId);

    res.send(feedData);
  } catch (error) {
    next(error);
  }
};

export const findMatchingPeersHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const matches = await findMatchingPeersService(userId);

    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export const searchUsersHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const currentUsername = req.user.username;
    const users = await searchUsersService(username, currentUsername);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
