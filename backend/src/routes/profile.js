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

    if (data.emailId || data.password || data.age) {
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
      throw new Error("Please Enter Your Current Password");
    }

    const isPasswordValid = await req.user.validatePassword(password);
    if (!isPasswordValid)
      res.status(500).send("Please Enter Correct Password !! ");

    if (newPassword.toString() === password.toString())
      res
        .status(500)
        .send("Updated Password can't be same as previous password");

    if (newPassword.toString() !== confirmPassword.toString())
      res.status(500).send("Confirm Password did not Match");

    if (!validator.isStrongPassword(newPassword))
      res
        .status(500)
        .send(
          "Password must be at least 8 characters long, include uppercase, lowercase, number, special character, and no spaces."
        );

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { password: hashedPassword }
    );

    // Clearing Old JWT token
    res.clearCookie("token");

    // Creating new Token for same user after updated password
    const newToken = await req.user.getJwtToken();
    res.cookie("token", newToken);

    res.send("Password Updated Successfully !!! ");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default profileRouter;
