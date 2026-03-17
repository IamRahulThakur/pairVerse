import multer from "multer";

import { BadRequestError } from "../utils/appError.js";

const IMAGE_MIME_PREFIX = "image/";
const VIDEO_MIME_PREFIX = "video/";

const memoryStorage = multer.memoryStorage();

const createFileFilter = (allowedPrefixes, errorMessage) => (req, file, cb) => {
  const isAllowed = allowedPrefixes.some((prefix) =>
    file.mimetype.startsWith(prefix)
  );

  if (!isAllowed) {
    return cb(new BadRequestError(errorMessage));
  }

  return cb(null, true);
};

const createUploader = ({ fileSize, allowedPrefixes, errorMessage }) =>
  multer({
    storage: memoryStorage,
    limits: { fileSize },
    fileFilter: createFileFilter(allowedPrefixes, errorMessage),
  });

export const uploadImage = createUploader({
  fileSize: 5 * 1024 * 1024,
  allowedPrefixes: [IMAGE_MIME_PREFIX],
  errorMessage: "Only image files are allowed",
});

export const uploadPostMedia = createUploader({
  fileSize: 10 * 1024 * 1024,
  allowedPrefixes: [IMAGE_MIME_PREFIX, VIDEO_MIME_PREFIX],
  errorMessage: "Only image or video files are allowed",
});
