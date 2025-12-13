import { notificationModel } from "../model/notifications.js";

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