"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseCastErrorHandlerFunction = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongooseCastErrorHandlerFunction = (error) => {
    const statusCode = http_status_codes_1.default.BAD_REQUEST;
    const message = `Cast error occurred to ${error.path}: ${error.value}! Please check the ${error.path} and try again.`;
    return { statusCode, message };
};
exports.mongooseCastErrorHandlerFunction = mongooseCastErrorHandlerFunction;
