import express from "express";
import { UserModel } from "../model/user.js";
import { validateSignupData } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { userAuth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Validate signup data
  try {
    // Validating the user input
    await validateSignupData(req);
    
    // Encrypt the password
    const { emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);


    // Creating a new user
    const user = new UserModel({
      emailId,
      password: hashedPassword,
    });
    console.log("User Created: ", user);
    await user.save();
    res.send({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    // Find user by email and Validating correct User
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid) {
      // Create JWT Token 
      const token = await user.getJwtToken();
      // Add Token to cookie and send response back to user
      res.cookie("token" , token);

      res.send("Logged in successfully");
    }
    else {
      throw new Error("Invalid Credentials...");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

authRouter.post("/logout",userAuth , async(req, res) => {
    res.clearCookie('token');
    res.send("Logged out Successfully......");
});

export default authRouter;