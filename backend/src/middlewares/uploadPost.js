import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import cloudinary from "../config/cloudinary.js";


const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage || require("multer-storage-cloudinary");

const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_posts",
    resource_type: "auto",
  },
});

export const uploadPost = multer({ storage: postStorage });