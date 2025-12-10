class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Status is 'fail' for client errors (4xx) and 'error' for server errors (5xx)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;
    
    // Captures the stack trace, excluding the constructor call for clean logging
    Error.captureStackTrace(this, this.constructor); 
  }
}

// 404: Resource Not Found
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

// 400: Bad Request (General user input error/Validation failure)
export class BadRequestError extends AppError {
    constructor(message = "Invalid input data or missing required fields") {
        super(message, 400);
    }
}

// 401: Unauthorized (Authentication failed - invalid password/token)
export class UnauthorisedError extends AppError {
    constructor(message = "Authentication failed. Invalid credentials or token missing") {
        super(message, 401);
    }
}

// 403: Forbidden (Authorization failed - authenticated user does not have permission)
export class ForbiddenError extends AppError {
    constructor(message = "Not authorized to perform this action") {
        super(message, 403);
    }
}

// 409: Conflict (Resource already exists - e.g., username taken, request already sent)
export class ConflictError extends AppError {
    constructor(message = "Resource already exists or connection request is invalid") {
        super(message, 409);
    }
}

export default AppError;