import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { UserModel } from "../model/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import {upload} from "../middlewares/multer.js";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  // Fetch user profile data
  const user = await UserModel.findById(req.user._id, {
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

  res.send(user);
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"), // handles optional file upload
  async (req, res) => {
    try {
      const data = req.body;

      // Clean techStack if provided
      if (data.techStack) {
        data.techStack = data.techStack.map((item) => item.trim());
      }

      // Disallow email/password changes
      if (data.emailId || data.password) {
        return res.status(422).send("Invalid Updates");
      }

      // Check for unique username
      if (data.username) {
        const existing = await UserModel.findOne({ username: data.username });
        if (existing && existing._id.toString() !== req.user._id.toString()) {
          return res.status(409).json({
            field: "username",
            message: "username exists",
          });
        }
      }

      // If image uploaded, set new photourl from Cloudinary
      if (req.file && req.file.path) {
        data.photourl = req.file.path;
      }

      // Update user
      const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  const { password, newPassword, confirmPassword } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: "Please Enter Your Current Password" });
    }

    const isPasswordValid = await req.user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Please Enter Correct Password !!" });
    }

    if (newPassword.toString() === password.toString()) {
      return res.status(400).json({ error: "Updated Password can't be same as previous password" });
    }

    if (newPassword.toString() !== confirmPassword.toString()) {
      return res.status(400).json({ error: "Confirm Password did not Match" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, special character, and no spaces.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { password: hashedPassword }
    );

    // Clear old JWT
    res.clearCookie("token");

    // Create new JWT
    const newToken = await req.user.getJwtToken();
    res.cookie("token", newToken);

    return res.json({ message: "Password Updated Successfully !!!" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server Error" });
  }
});

profileRouter.get("/profile/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;

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
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default profileRouter;
