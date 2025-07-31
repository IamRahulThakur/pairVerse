import validator from 'validator';

export const validateSignupData = (req) => {
    const {emailId, password} = req.body;

    if(!emailId || !password) {
        throw new Error("All fields are required");
    }

    else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }   
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long, include uppercase, lowercase, number, special character, and no spaces.");
    }
}