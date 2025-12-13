import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import cloudinary from "../config/cloudinary.js";

const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage || require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_photos",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const upload = multer({ storage });