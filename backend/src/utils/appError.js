class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor); 
  }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Invalid input data or missing required fields") {
        super(message, 400);
    }
}

export class UnauthorisedError extends AppError {
    constructor(message = "Authentication failed. Invalid credentials or token missing") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Not authorized to perform this action") {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists or connection request is invalid") {
        super(message, 409);
    }
}

export default AppError;