"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseDuplicateErrorHandlerFunction = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongooseDuplicateErrorHandlerFunction = (error) => {
    const statusCode = http_status_codes_1.default.BAD_REQUEST;
    const duplicateKey = Object.keys(error.keyValue);
    const duplicateValue = error.keyValue[duplicateKey.toString()];
    const message = `Duplicate value entered for ${duplicateKey}: ${duplicateValue}`;
    return { statusCode, message };
};
exports.mongooseDuplicateErrorHandlerFunction = mongooseDuplicateErrorHandlerFunction;
