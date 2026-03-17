import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadImageService = async (file) => {
  return uploadBufferToCloudinary(file.buffer, {
    folder: "pairverse/uploads",
    resource_type: "image",
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
  });
};
