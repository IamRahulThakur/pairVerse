import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_posts",
    resource_type: "auto", // allows images + videos
  },
});

export const uploadPost = multer({ storage: postStorage });
