import express from 'express';
import { userAuth } from '../middlewares/auth.middleware.js';

import { respondRequestHandler, sendRequestHandler } from '../controllers/request.controller.js';

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, sendRequestHandler);

// Accept of Reject Request
requestRouter.post("/request/review/:status/:requestId", userAuth, respondRequestHandler);



export default requestRouter;
