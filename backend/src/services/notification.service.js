import { notificationModel } from "../models/notification.model.js";

export const createAndSaveNotification = async (payload) => {
    
    const notification = new notificationModel({
        fromUserId: payload.fromUserId,
        toUserId: payload.toUserId,
        type: payload.type,
        title: payload.title,
        status: payload.status || 'unread',
    });

    await notification.save();
    
    return notification;
};

export const deleteReadNotificationsOlderThanService = async (days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return notificationModel.deleteMany({
        updatedAt: { $lt: cutoffDate },
        status: "read",
    });
};
