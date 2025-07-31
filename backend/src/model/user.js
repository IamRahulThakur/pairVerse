import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Enter Valid Gender")
            }
        }
    },
    photourl: {
        type: String,
        default: "https://images.app.goo.gl/fx79WosVnmDFnnLk8",
    },
    bio: {
        type: String,
        default: "This is a default bio for user",
    },
    domain: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String],
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
        default: "beginner",
        validate(value) {
            if(!["beginner", "intermediate", "advanced"].includes(value)) {
                throw new Error("Enter Valid Experience Level")
            }
        }
    },
    timezone: {
        type: String,
        required: true,
        default: "Asia/Kolkata",
    },
    linkedIn: {
        type: String,
        validate(value) {
            if(!value.startsWith("https://www.linkedin.com/")) {
                throw new Error("Enter Valid LinkedIn URL")
            }
        }
    },
    Github: {
        type: String,
    },
},{timestamps: true} );

export const UserModel = mongoose.model("User", userSchema);