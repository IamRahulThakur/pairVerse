import {
  editProfileService,
  getProfileService,
  getUserProfileByIdService,
  updatePasswordService,
} from "../services/profileService.js";

export const getProfileHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await getProfileService(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const editProfileHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user._id;
    const reqFile = req.file;

    const updatedUser = await editProfileService(userId, data, reqFile);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePasswordHandler = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const user = req.user;

    const newToken = await updatePasswordService(
      password,
      newPassword,
      confirmPassword,
      user
    );
    res.clearCookie("token");
    res.cookie("token", newToken);
    return res.json({ message: "Password Updated Successfully !!!" });
  } catch (error) {
    next(error);
  }
};

export const getUserProfileByIdHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await getUserProfileByIdService(userId);

    res.send(user);
  } catch (error) {
    next(error);
  }
};