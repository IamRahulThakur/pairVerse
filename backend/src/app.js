import express from 'express';
import connectDB from './config/database.js';
import {UserModel} from './model/user.js'; // Assuming you have a User model defined// Importing the UserModel 
const app = express();

app.post("/signup",  async (req, res) => {
  const user = new UserModel({
    firstName: "Sunny",
    lastName: "Thakur",
    emailId: "akppkapadjfp@g,ail.com",
    password: "kadbfjab",
  })
  // Always use try-catch block for async operation to handle errors
  try {
    await user.save();
    res.send({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: "Error creating user",
      error: error.message,
    });
  }
});


connectDB().then(() => {
  console.log("Database connected successfully");
  // Start the server after successful database connection
  app.listen(3000, () => {
  console.log('Server is running on port 3000');
  });
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});