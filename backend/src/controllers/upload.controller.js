import { BadRequestError } from "../utils/appError.js";
import { uploadImageService } from "../services/upload.service.js";

export const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequestError("Image file is required");
    }

    const uploadedImage = await uploadImageService(req.file);

    res.status(201).json({
      message: "Image uploaded successfully",
      secure_url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });
  } catch (error) {
    next(error);
  }
};
