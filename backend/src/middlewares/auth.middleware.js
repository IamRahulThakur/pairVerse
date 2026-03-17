import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { UnauthorisedError } from "../utils/appError.js";


export const userAuth =async (req, res, next) => {
  try {
    // Read Token From Cookies
    const token = req.cookies.token;

    // Validate Token 
    if (!token) {
      throw new UnauthorisedError("Please Login First...");
    }
    
    // Decoded return a object contain {paylod , iat(issued at time)}
    // In our case payload was {userId: user._id} 
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    // So here we are taking userId from decoded Object
    const userId = decoded.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new UnauthorisedError("User not found");
    }
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error?.isOperational) {
      return next(error);
    }

    return next(new UnauthorisedError(error.message));
  }
};
