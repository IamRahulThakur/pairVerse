import { loginService, signupService } from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signupHandler = async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    const { user, token } = await signupService(emailId, password);

    res.cookie("token", token, cookieOptions);

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    const { user, token } = await loginService(emailId, password);

    res.cookie("token", token, cookieOptions);

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (req, res) => {
  res.clearCookie("token", {
    secure: true,
    sameSite: "none",
  });

  res.send("Logged out Successfully");
};