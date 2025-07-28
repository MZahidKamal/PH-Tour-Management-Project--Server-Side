import {NextFunction, Request, Response} from "express";
import envConfig from "../config/envConfig";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";



/*const globalErrorHandlerMiddleware = (error: any, req: Request, res: Response, _next: NextFunction) => {

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = `Something went wrong! Error: ${error.message}`;
    let errorStack = envConfig.node_environment === 'development' ? error.stack : '🔒 Not disclosed for security reasons';

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errorStack = error.stack;
    }

    if (error instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = error.message;
        errorStack = error.stack;
    }

    res.status(statusCode).json({
        success: false,
        message,
        error,
        stack: errorStack
    });
}*/



const globalErrorHandlerMiddleware = (error: unknown, req: Request, res: Response, _next: NextFunction) => {

    // type-guard
    const err = error instanceof Error ? error : new Error('Unknown error');
    const statusCode = err instanceof AppError ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message;
    const errorStack = envConfig.node_environment === 'development' ? err.stack : '🔒 Not disclosed';

    res.status(statusCode).json({
        success: false,
        message,
        error_G: err,
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
