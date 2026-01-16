import { UserModel } from "../model/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/appError.js";
import redis from "../config/redis.js";

export const getProfileService = async (userId) => {
  return await UserModel.findById(userId, {
    firstName: 1,
    lastName: 1,
    username: 1,
    age: 1,
    emailId: 1,
    photourl: 1,
    linkedIn: 1,
    bio: 1,
    techStack: 1,
    experienceLevel: 1,
    Github: 1,
    age: 1,
    domain: 1,
    gender: 1,
  });
};

export const editProfileService = async (userId, data, reqFile) => {
  if (data.techStack) {
    data.techStack = data.techStack.map((item) => item.trim());
  }

  if (data.emailId || data.password) {
    throw new ConflictError("Email or Password cannot be updated here");
  }

  if (data.username) {
    const existing = await UserModel.findOne({ username: data.username });
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new ConflictError("Username already taken");
    }
  }

  const updates = { ...data };

  if (reqFile) {
    const cloudinaryUrl = reqFile.path || reqFile.secure_url || reqFile.url;

    if (cloudinaryUrl) {
      updates.photourl = cloudinaryUrl;
    }
  }

  await redis.del(`matchingPeers:${userId}`);

  return await UserModel.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
};

export const updatePasswordService = async (password , newPassword, confirmPassword, user) => {
    if (!password) {
      throw new BadRequestError("Please Enter Your Current Password");
    }

    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
        throw new BadRequestError("Current Password is incorrect");
    }

    if (newPassword.toString() === password.toString()) {
        throw new ConflictError("New Password cannot be same as Current Password");
    }

    if (newPassword.toString() !== confirmPassword.toString()) {
      throw new BadRequestError("Confirm Password did not Match");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new BadRequestError("Password is not strong enough");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedPassword }
    );

    const newToken = await user.getJwtToken();
    return newToken;
};

export const getUserProfileByIdService = async(userId) => {
    const user = await UserModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      username: 1,
      age: 1,
      photourl: 1,
      bio: 1,
      techStack: 1,
      experienceLevel: 1,
      linkedIn: 1,
      Github: 1,
      domain: 1,  
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
};