"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseValidationErrorHandlerFunction = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongooseValidationErrorHandlerFunction = (error) => {
    const statusCode = http_status_codes_1.default.BAD_REQUEST;
    const sentences = Object.values(error.errors).map((err) => {
        var _a;
        return `${err.name} occurred in the ${err.path} field, expected type is ${(_a = err.kind) === null || _a === void 0 ? void 0 : _a.toUpperCase()}, but received ${err.value} instead.`;
    });
    const message = sentences.join(' ');
    return { statusCode, message };
};
exports.mongooseValidationErrorHandlerFunction = mongooseValidationErrorHandlerFunction;
