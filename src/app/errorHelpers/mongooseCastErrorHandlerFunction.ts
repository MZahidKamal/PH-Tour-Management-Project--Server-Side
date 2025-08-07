import mongoose from "mongoose";
import httpStatus from "http-status-codes";
import {errorHandlerInterface} from "../globalInterfaces/errorHandlerFunctionInterface";



export const mongooseCastErrorHandlerFunction = (error: mongoose.Error.CastError): errorHandlerInterface => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const message = `Cast error occurred to ${error.path}: ${error.value}! Please check the ${error.path} and try again.`;
    return {statusCode, message}
}
