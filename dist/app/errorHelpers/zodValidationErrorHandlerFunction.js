"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidationErrorHandlerFunction = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const zodValidationErrorHandlerFunction = (error) => {
    const statusCode = http_status_codes_1.default.BAD_REQUEST;
    const sentences = error.issues.map((issue) => {
        return `${issue.message}, but it has got an ${issue.code} error.`;
    });
    const message = sentences.join(' ');
    return { statusCode, message };
};
exports.zodValidationErrorHandlerFunction = zodValidationErrorHandlerFunction;
