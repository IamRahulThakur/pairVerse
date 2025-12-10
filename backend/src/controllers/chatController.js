export const chatHandler =   async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    
    const {chat , targetUser} = await chatService(userId, targetUserId);

    res.json({
      chat: chat,
      user: targetUser.firstName
    });
  } catch (error) {
    next(error);
  }
};