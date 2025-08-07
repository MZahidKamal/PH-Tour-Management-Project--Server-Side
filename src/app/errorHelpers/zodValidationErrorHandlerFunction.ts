import httpStatus from "http-status-codes";
import {errorHandlerInterface} from "../globalInterfaces/errorHandlerFunctionInterface";
import { ZodError, ZodIssue } from "zod";



export const zodValidationErrorHandlerFunction = (error: ZodError): errorHandlerInterface => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const sentences: string[] = error.issues.map((issue: ZodIssue) => {
        return `${issue.message}, but it has got an ${issue.code} error.`;
    });
    const message: string = sentences.join(' ');
    return {statusCode, message}
}
