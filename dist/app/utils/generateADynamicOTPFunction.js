"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateADynamicOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateADynamicOTP = (length = 6) => {
    const dynamicOTP = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString().padStart(length, '0');
    return dynamicOTP;
};
exports.generateADynamicOTP = generateADynamicOTP;
