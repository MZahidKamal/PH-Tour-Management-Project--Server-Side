"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = __importDefault(require("../config/envConfig"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const zodValidationErrorHandlerFunction_1 = require("../errorHelpers/zodValidationErrorHandlerFunction");
const mongooseDuplicateErrorHandlerFunction_1 = require("../errorHelpers/mongooseDuplicateErrorHandlerFunction");
const mongooseCastErrorHandlerFunction_1 = require("../errorHelpers/mongooseCastErrorHandlerFunction");
const mongooseValidationErrorHandlerFunction_1 = require("../errorHelpers/mongooseValidationErrorHandlerFunction");
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
const cloudinary_config_1 = require("../config/cloudinary.config");
/* eslint-disable @typescript-eslint/no-explicit-any */
const globalErrorHandlerMiddleware = (error, req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('Researching Error: ', error);
    let statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let message = `Something went wrong!`;
    // If any problem happens while uploading image/images into cloudinary, then we will get error in req
    // And therefore, if the req.file or req.files consists any image url from cloudinary, then delete it
    if (req.file) {
        yield (0, cloudinary_config_1.deleteAnImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        yield Promise.all(req.files.map((file) => (0, cloudinary_config_1.deleteAnImageFromCloudinary)(file.path)));
    }
    // Zod validation error from Zod handled properly
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ZodError') {
        const errorHandled = (0, zodValidationErrorHandlerFunction_1.zodValidationErrorHandlerFunction)(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }
    // Duplicated key error from MongoDB handled properly
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const errorHandled = (0, mongooseDuplicateErrorHandlerFunction_1.mongooseDuplicateErrorHandlerFunction)(error);
        message = errorHandled.message;
        statusCode = errorHandled.statusCode;
    }
    // Cast error from MongoDB handled properly
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        const errorHandled = (0, mongooseCastErrorHandlerFunction_1.mongooseCastErrorHandlerFunction)(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }
    // Mongoose validation error from MongoDB handled properly
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const errorHandled = (0, mongooseValidationErrorHandlerFunction_1.mongooseValidationErrorHandlerFunction)(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }
    // Custom error from our AppError handled properly
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Generic error from our Error handled properly
    else if (error instanceof Error) {
        statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
        message = error.message;
    }
    const error_G = envConfig_1.default.node_environment === 'development' ? error : '🔒 Only disclosed in development mode';
    const errorStack = envConfig_1.default.node_environment === 'development' ? error === null || error === void 0 ? void 0 : error.stack : '🔒 Only disclosed in development mode';
    res.status(statusCode).json({
        success: false,
        message,
        error_G,
        stack: errorStack
    });
});
exports.default = globalErrorHandlerMiddleware;
/*
The underscore prefix tells ESLint that we intentionally aren't using this parameter, but we need it in the function
signature for Express to recognize it as error handling middleware. This is a cleaner solution than using disable
comments.
We don't need to use the _next parameter in the global error handler because it's the last middleware in your chain.
The parameter is just required in the signature for Express to recognize it as error handling middleware.
*/
