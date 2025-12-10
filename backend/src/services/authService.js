import { UserModel } from "../model/user.js";
import { ConflictError, UnauthorisedError } from "../utils/appError.js";
import { validateSignupData } from "../utils/validation.js";
import bcrypt from "bcrypt";

export const signupService = async (emailId , password) => {
  await validateSignupData({body : {emailId , password}});
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await UserModel.findOne({ emailId });
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }
  const user = new UserModel({
    emailId,
    password: hashedPassword,
  });

  await user.save();

  const token = await user.getJwtToken();

  return {user , token};
}

export const loginService = async (emailId , password) => {
  const user = await UserModel.findOne({ emailId });
  if (!user) {
    throw new UnauthorisedError("Invalid Credentials");
  }

  const isPasswordValid = await user.validatePassword(password);
  
  if(!isPasswordValid) {
    throw new UnauthorisedError("Invalid Credentials");
  }

  const token = await user.getJwtToken();
  return {user , token };
}