import express from 'express';
import connectDB from './config/database.js';
import {UserModel} from './model/user.js'; // Assuming you have a User model defined// Importing the UserModel 
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies


app.post("/signup",  async (req, res) => {
  const user = new UserModel(req.body)
  // Always use try-catch block for async operation to handle errors
  try {
    await user.save();
    res.send({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});


app.get("/getuser", async (req, res) => {
  try {
    const emailID = await UserModel.findOne({ emailId: req.body.emailId });
    if (emailID) {
      res.send(emailID);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


app.get("/feed" , async (req, res) => {
  try {
    const data = await UserModel.find({});
    if(data)
      res.send(data);
    else
      res.status(404).send({ message: "User not found" });
  }
  catch (error) {
    res.status(404).send({error : error.message});
  }
})


app.delete("/user" , async (req , res) => {
  try {
    const userId = req.body.userId;
    await UserModel.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  }
  catch(error) {
    res.status(404).send({error : error.message});
  }
})

app.patch("/user" , async (req , res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    await UserModel.findByIdAndUpdate(userId , data);
    res.send("User Updated Successfully...")
  }
  catch(error) {
    res.status(404).send({error : error.message});
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