import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { UserModel } from '../model/user.js';

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async(req, res) => {
  const user = await UserModel.findById(req.userId);
  res.send(user)

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