import httpStatus from "http-status-codes";
import {errorHandlerInterface} from "../globalInterfaces/errorHandlerFunctionInterface";





interface MongooseDuplicateKeyErrorInterface {
    code: number;
    keyValue: Record<string, string>;
}





export const mongooseDuplicateErrorHandlerFunction = (error: MongooseDuplicateKeyErrorInterface): errorHandlerInterface => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const duplicateKey: string[] = Object.keys(error.keyValue);
    const duplicateValue = error.keyValue[duplicateKey.toString()];
    const message = `Duplicate value entered for ${duplicateKey}: ${duplicateValue}`;
    return {statusCode, message}
}
