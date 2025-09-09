import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.js";


export const userAuth =async (req, res, next) => {

  try {
    // Read Token From Cookies
    const token = req.cookies.token;

    // Validate Token 
    if (!token) {
      return res.status(401).send({ error: "Please Login First..." });
    }
    
    // Decoded return a object contain {paylod , iat(issued at time)}
    // In our case payload was {userId: user._id} 
    const decoded = jwt.verify(token , "Rahul@2#$%^&*3");
    // So here we are taking userId from decoded Object
    const userId = decoded.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not Found...");
    }
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).send({error: error.message});
  }
};
