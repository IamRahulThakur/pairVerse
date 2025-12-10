import { ConnectionRequestModel } from "../model/connectionRequest.js";
import { notificationModel } from "../model/notifications.js";
import { UserModel } from "../model/user.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/appError.js";

export const sendRequestService = async (
  fromUserId,
  toUserId,
  status,
  user
) => {

  const findToUserId = await UserModel.findById(toUserId);
  if (!findToUserId) {
    throw new NotFoundError("User Does not exists");
  }

  const allowedStatus = ["interested"];
  if (!allowedStatus.includes(status)) {
    throw new BadRequestError("Invalid Status type");
  }

  const existingRequestCheck = await ConnectionRequestModel.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingRequestCheck) {
    throw new ConflictError("Connection request already exist");
  }

  const connectionRequest = new ConnectionRequestModel({
    fromUserId,
    toUserId,
    status,
  });
  const data = await connectionRequest.save();

  const notificationCreated = new notificationModel({
    fromUserId: fromUserId,
    toUserId: toUserId,
    type: "connection_request",
    title: `New connection request from ${user.firstName}`,
    status: "unread",
  });

  const notification = await notificationCreated.save();

  return { data, notification };
};

export const respondRequestService = async(status , requestId , userId) => {
        
    const connectionRequest = await ConnectionRequestModel.findById(requestId);
        if (!connectionRequest) {
            throw new NotFoundError("Connection Request not found");
        }

        if (connectionRequest.status !== "interested") {
            throw new BadRequestError("Connection Request already reviewed");
        }

        if (userId.toString() !== connectionRequest.toUserId.toString()) {
          throw new BadRequestError("Not authorized to review this request");
        }

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new BadRequestError("Not a valid choice to update!");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        const user = await UserModel.findById(userId);

        if(status === "accepted") {
            const notification = new notificationModel({
                fromUserId: connectionRequest.toUserId,
                toUserId: connectionRequest.fromUserId,
                type: "connection_request",
                title: `Your connection request has been ${status} by ${user.firstName}`,
                status: "unread"
            });
            await notification.save();
        }
        return data;
};