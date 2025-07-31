import express from "express";
import connectDB from "./config/database.js";
import { UserModel } from "./model/user.js";
import { validateSignupData } from "./utils/validation.js";
import bcrypt from "bcrypt";
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/signup", async (req, res) => {
  // Validate signup data
  try {
    // Validating the user input
    validateSignupData(req);

    // Encrypt the password
    const { emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);

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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ emailId });
    // Validate the user
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    res.send("Logged in successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/profile", async (req, res) => {
  const data = req.body;

  try {
    if (data.emailId) {
      throw new Error("Email ID cannot be updated");
    }

    // Update user profile
    const user = await UserModel.findByIdAndUpdate(req.body.userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Send updated user data
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/getuser", async (req, res) => {
  try {
    const emailId = await UserModel.findOne({ emailId: req.body.emailId });
    if (emailId) {
      res.send(emailId);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await UserModel.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.patch("/user/:userID", async (req, res) => {
  const userId = req.params?.userID;
  const data = req.body;
  try {
    // Validating if emailId is being updated
    if (data.emailId) {
      throw new Error("Invalid updates!");
    }

    await UserModel.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully...");
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    // Start the server after successful database connection
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
