import { loginService, signupService } from "../services/authService.js";

export const signupHandler = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const {user , token} = await signupService(emailId , password);
        
        res.cookie("token" , token);

        res.send(user);
    } 
    catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

export const loginHandler = async (req, res) => {
    
    try {
        const { emailId, password } = req.body;

        const {user , token } = await loginService(emailId, password);
        res.cookie("token" , token);
        res.send(user);
    } catch (error) {
        
        if (error.message === "Invalid credentials") {
            return res.status(401).send({ error: error.message });
        }
        
        res.status(500).send({ error: error.message });
    }
};

export const logoutHandler = async(req, res) => {
    res.clearCookie('token');
    res.send("Logged out Successfully......");
};