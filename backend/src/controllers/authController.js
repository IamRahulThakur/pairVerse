import { loginService, signupService } from "../services/authService.js";

export const signupHandler = async (req, res, next) => {
    try {
        const { emailId, password } = req.body;

        const {user , token} = await signupService(emailId , password);
        
        res.cookie("token" , token);

        res.send(user);
    } 
    catch (error) {
        next(error);
    }
};

export const loginHandler = async (req, res, next) => {
    
    try {
        const { emailId, password } = req.body;

        const {user , token } = await loginService(emailId, password);
        res.cookie("token" , token);
        res.send(user);
    } catch (error) {
        next(error);
    }
};

export const logoutHandler = async(req, res) => {
    res.clearCookie('token');
    res.send("Logged out Successfully......");
};