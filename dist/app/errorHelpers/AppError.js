"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message, stack) {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
/*
This code defines a custom error class called `AppError` that is specifically designed for handling errors in what appears to be an Express.js application.

Here's what it does:
1. It extends JavaScript's built-in `Error` class, which means it inherits all basic error functionality
2. It adds a new property called `statusCode` to store HTTP status codes
3. The constructor takes three parameters:
   - `statusCode`: A number representing the HTTP status code
   - `message`: The error message
   - `stack`: An optional parameter for the error stack trace
        - If a stack trace is provided, it uses that
        - If no stack trace is provided, it automatically captures one using `Error.captureStackTrace()`

This is a common pattern in Node.js/Express applications for standardized error handling and providing meaningful error responses to clients.
*/
