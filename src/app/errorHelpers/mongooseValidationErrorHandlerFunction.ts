import mongoose from "mongoose";
import httpStatus from "http-status-codes";
import {errorHandlerInterface} from "../globalInterfaces/errorHandlerFunctionInterface";



export const mongooseValidationErrorHandlerFunction = (error: mongoose.Error.ValidationError): errorHandlerInterface => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const sentences: string[] = Object.values(error.errors).map((err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return `${err.name} occurred in the ${err.path} field, expected type is ${err.kind?.toUpperCase()}, but received ${err.value} instead.`;
    })
    const message = sentences.join(' ');
    return {statusCode, message}
}
