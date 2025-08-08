import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { ConnectionRequestModel } from '../model/connectionRequest.js';
import { UserModel } from '../model/user.js';

const userRouter = express.Router();

const USER_SAFE_DATA = [
    "firstName", 
    "lastName", 
    "gender",
    "photourl",
    "techStack",
    "experienceLevel",
    "linkedIn",
    "Github"
]

// Get all pending Request for User
userRouter.get("/user/requests/received" , userAuth, async (req , res) => {
    
    try {
        // Isme hame bas vo data bejna hai jo where toUserId 
        // is req.userId
        const data =  await ConnectionRequestModel.find({
            toUserId: req.userId,
            status: "intrested"
        }).populate('fromUserId', "firstName lastName");

        res.send(data);

    } 
    catch (error) {
        res.status(500).send({error : error.message});
    }
});


// Get Connection List
userRouter.get("/user/connections", userAuth , async (req, res) => {

    try {
        // DB se vo id nikalni hai jisme toUserId login person
        // ki userId hai and status accepted hai
        const connectionData =  await ConnectionRequestModel.find({
            $or: [
                {toUserId: req.userId, status: "accepted"},
                {fromUserId: req.userId , status: "accepted"}
            ]
        }).populate('toUserId', USER_SAFE_DATA).populate('fromUserId' , USER_SAFE_DATA);
 
        const data = connectionData.map((row) => {
                if(row.toUserId._id.toString() === req.userId.toString()) {
                    return row.fromUserId;
                }
                else {
                    return row.toUserId;
                }
        });

        res.send(data);
    }
    catch (error) {
        res.status(500).send({error : error.message});
    }
});


// Get Feed of Users
userRouter.get("/user/feed", userAuth , (req, res) => {
    try {
        
    }
    catch (err) {
        res.status(500).send({error: err.message});
    }
})

export default userRouter; 