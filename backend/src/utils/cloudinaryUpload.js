import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";
import { BadRequestError } from "./appError.js";

export const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!buffer) {
      reject(new BadRequestError("File buffer is required for upload"));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(
            new BadRequestError(
              `Cloudinary upload failed: ${error.message || "Unknown error"}`
            )
          );
          return;
        }

        if (!result) {
          reject(new BadRequestError("Cloudinary upload did not return a file"));
          return;
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
