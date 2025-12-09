import { UserModel } from "../model/user.js";
import { validateSignupData } from "../utils/validation.js";
import bcrypt from "bcrypt";

export const signupService = async (emailId , password) => {
  await validateSignupData({body : {emailId , password}});
  
  const hashedPassword = await bcrypt.hash(password, 10);

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
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await user.validatePassword(password);
  
  if(!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = await user.getJwtToken();
  return {user , token };
}