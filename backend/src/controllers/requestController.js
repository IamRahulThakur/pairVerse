import { respondRequestService, sendRequestService } from "../services/requestService.js";


export const sendRequestHandler = async (req, res, next) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const user = req.user;

        const data = await sendRequestService(
            fromUserId,
            toUserId,
            status,
            user
        );

        res.json({
            message: "Connection Made Successfully",
            data,
        })
    }
    catch (error) {
        next(error);
    }
};

export const respondRequestHandler = async (req, res, next) => {
    try {
        const status = req.params.status;
        const requestId = req.params.requestId;
        const userId = req.user._id;

        const data = await respondRequestService(
            status,
            requestId,
            userId
        );

        res.json({
            message: `Connection Request ${status}`,
            data
        });

    } catch (error) {
        next(error);
    }
};