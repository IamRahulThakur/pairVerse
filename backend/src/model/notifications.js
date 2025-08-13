import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    type : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["unread", "read"],
            message: '{VALUE} is not a valid status'
        },
        default: "unread",
        required: true
    }
}, { timestamps: true });

notificationSchema.index({ toUserId: 1, status: 1, createdAt: -1 });

const notificationModel = mongoose.model(
    "Notification", 
    notificationSchema
);

export {notificationModel}