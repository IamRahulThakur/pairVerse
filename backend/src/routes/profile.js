import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { UserModel } from '../model/user.js';

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async(req, res) => {
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
    experienceLevel : 1,
    Github: 1,
    age: 1,
    domain: 1,
  });

  res.send(user);
})

profileRouter.patch("/profile/edit", userAuth ,async (req, res) => {
  try {
    const data = req.body;

    if (data.emailId || data.password) {
      throw new Error("Invalid edit Request...");
    }

    // Update user profile
    const user = await UserModel.findByIdAndUpdate(req.userId, data, {
      new: true,
      runValidators: true,
    });

    // Send updated user data
    res.send("User Data Updated Successfully....");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default profileRouter;