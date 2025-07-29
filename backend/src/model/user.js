import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
});

export const UserModel = mongoose.model("User", userSchema);