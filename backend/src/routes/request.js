import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { ConnectionRequestModel } from '../model/connectionRequest.js';
import { UserModel } from '../model/user.js';

const requestRouter = express.Router();

requestRouter.get("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.userId;
        const toUserId = req.params.toUserId;
        const status = req.params.status;


        // Checking request of toUserId exist in DB
        const findToUserId = await UserModel.findById(toUserId);
        if(!findToUserId) {
            throw  new Error("User Does not exists");
        }

        const allowedStatus = ["intrested", "ignored"];
        if(!allowedStatus.includes(status)) {
            return res.
                status(400)
                .json({message:"Invalid Satus Type"})
        }

        // If there is existing Connection Request or
        //  If toUserId want to send connection to from user Id
        // If request already exist then we can't allow user to send again
        const existingRequestCheck = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId:fromUserId},
            ]
        })

        if(existingRequestCheck) {
            throw new Error("Connection request already exists !!!!");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
        res.json({
            message: "Connection Made Successfully",
            data,
        })
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default requestRouter;