import multer from "multer";

import { BadRequestError } from "../utils/appError.js";

export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new BadRequestError("Uploaded file exceeds the allowed size limit"));
    }

    return next(new BadRequestError(err.message));
  }

  return next(err);
};

export const handleApplicationErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (statusCode === 500) {
    console.error("SERVER ERROR :", err);
  }

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong! Please try again later.",
  });
};
