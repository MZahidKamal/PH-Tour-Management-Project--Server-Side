import {NextFunction, Request, Response} from "express";
import envConfig from "../config/envConfig";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import {zodValidationErrorHandlerFunction} from "../errorHelpers/zodValidationErrorHandlerFunction";
import {mongooseDuplicateErrorHandlerFunction} from "../errorHelpers/mongooseDuplicateErrorHandlerFunction";
import {mongooseCastErrorHandlerFunction} from "../errorHelpers/mongooseCastErrorHandlerFunction";
import {mongooseValidationErrorHandlerFunction} from "../errorHelpers/mongooseValidationErrorHandlerFunction";
import {consolePrint} from "../utils/consolePrintFunction";
import {deleteAnImageFromCloudinary} from "../config/cloudinary.config";




/* eslint-disable @typescript-eslint/no-explicit-any */
const globalErrorHandlerMiddleware = async (error: any, req: Request, res: Response, _next: NextFunction) => {

    consolePrint('Researching Error: ', error)

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = `Something went wrong!`;

    // If any problem happens while uploading image/images into cloudinary, then we will get error in req
    // And therefore, if the req.file or req.files consists any image url from cloudinary, then delete it
    if (req.file) {
        await deleteAnImageFromCloudinary(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        await Promise.all(
            req.files.map((file: Express.Multer.File) =>
                deleteAnImageFromCloudinary(file.path)
            )
        );
    }

    // Zod validation error from Zod handled properly
    if(error?.name === 'ZodError'){
        const errorHandled = zodValidationErrorHandlerFunction(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }

    // Duplicated key error from MongoDB handled properly
    else if (error?.code === 11000){
        const errorHandled = mongooseDuplicateErrorHandlerFunction(error);
        message = errorHandled.message;
        statusCode = errorHandled.statusCode;
    }

    // Cast error from MongoDB handled properly
    else if (error?.name === 'CastError'){
        const errorHandled = mongooseCastErrorHandlerFunction(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }

    // Mongoose validation error from MongoDB handled properly
    else if (error?.name === 'ValidationError') {
        const errorHandled = mongooseValidationErrorHandlerFunction(error);
        statusCode = errorHandled.statusCode;
        message = errorHandled.message;
    }

    // Custom error from our AppError handled properly
    else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }

    // Generic error from our Error handled properly
    else if (error instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = error.message;
    }

    const error_G = envConfig.node_environment === 'development' ? error : '🔒 Only disclosed in development mode';
    const errorStack = envConfig.node_environment === 'development' ? error?.stack : '🔒 Only disclosed in development mode';

    res.status(statusCode).json({
        success: false,
        message,
        error_G,
        stack: errorStack
    });
};





export default globalErrorHandlerMiddleware;










/*
The underscore prefix tells ESLint that we intentionally aren't using this parameter, but we need it in the function
signature for Express to recognize it as error handling middleware. This is a cleaner solution than using disable
comments.
We don't need to use the _next parameter in the global error handler because it's the last middleware in your chain.
The parameter is just required in the signature for Express to recognize it as error handling middleware.
*/
