import { loginService, signupService } from "../services/authService.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,                    
  sameSite: isProd ? "none" : "lax", 
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

if(isProd) {
  cookieOptions.domain = ".onrender.com";
}

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