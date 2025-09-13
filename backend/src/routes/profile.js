import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { UserModel } from "../model/user.js";
import validator from "validator";
import bcrypt from "bcrypt";

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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const data = req.body;

    if (data.emailId || data.password) {
      return res.status(422).send("Invalid Updates");
    }

    const username = req.body.username;
    if (username) {
      const user = await UserModel.findOne({ username });
      if (user && user._id.toString() !== req.user._id.toString()) {
        return res.status(409).json({
          field: "username",
          message: "username exists",
        });
      }
    }
    // Update user profile
    await UserModel.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });

    // Send updated user data
    res.send("User Data Updated Successfully....");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

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

export default profileRouter;
