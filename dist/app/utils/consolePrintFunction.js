"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consolePrint = void 0;
/* eslint-disable no-console */
const envConfig_1 = __importDefault(require("../config/envConfig"));
/* eslint-disable @typescript-eslint/no-explicit-any*/
const consolePrint = (...args) => {
    if (envConfig_1.default.node_environment === 'development') {
        const stack = new Error().stack;
        const callerLine = stack === null || stack === void 0 ? void 0 : stack.split('\n')[2]; // Get the caller's line (index 2 has the caller's info)
        const match = (callerLine === null || callerLine === void 0 ? void 0 : callerLine.match(/\((.+):(\d+):(\d+)\)/)) || (callerLine === null || callerLine === void 0 ? void 0 : callerLine.match(/at (.+):(\d+):(\d+)/));
        if (match) {
            const [, filePath, lineNumber] = match;
            const fileName = filePath.split(/[/\\]/).pop(); // Works for both Windows and Unix paths
            console.log(`[${fileName}:${lineNumber}]`, ...args);
        }
        else {
            console.log(...args);
        }
    }
    else
        console.log('🔒 Only disclosed in development mode');
};
exports.consolePrint = consolePrint;
