import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { ConflictError } from "../utils/appError.js";

// Profile picture uploads
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_photos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },
});

// Post media uploads (images + videos)
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "user_posts",
      resource_type: "auto", // IMPORTANT for video
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "mp4",
        "mov",
        "avi",
        "mkv",
      ],
    };
  },
});



// Profile photo upload (strict, small)
export const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ConflictError("Only image files are allowed"), false);
    }
  },
});

// Post media upload (image + video)
export const uploadPost = multer({
  storage: postStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new ConflictError("Only image or video files are allowed"), false);
    }
  },
});