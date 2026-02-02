import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 4,
        maxLength: 10
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not supported'
        },
    },
    photourl: {
        type: String,
        default: "https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
    },
    bio: {
        type: String,
        default: "This is a default bio for user",
    },
    domain: {
        type: String,
    },
    techStack: {
        type: [String],
    },
    experienceLevel: {
        type: String,
        default: "beginner",
        validate(value) {
            if(!["beginner", "intermediate", "advanced"].includes(value)) {
                throw new Error("Enter Valid Experience Level")
            }
        }
    },
    timezone: {
        type: String,
        default: "Asia/Kolkata",
    },
    linkedIn: {
        type: String,
        validate(value) {
            if(value && !value.startsWith("https://www.linkedin.com/")) {
                throw new Error("Enter Valid LinkedIn URL")
            }
        }
    },
    Github: {
        type: String,
    },
},{timestamps: true} );


userSchema.methods.validatePassword = async function(EnteredPassword) {
    const user = this;
    const isMatch = await bcrypt.compare(EnteredPassword, user.password);
    return isMatch;
}

userSchema.methods.getJwtToken = async function() {
    const user = this;
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
    return token;
}

export const UserModel = mongoose.model("User", userSchema);