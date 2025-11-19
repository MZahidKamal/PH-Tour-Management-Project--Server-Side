"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPControllers = void 0;
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const otp_service_1 = require("./otp.service");
const SendOTPController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield otp_service_1.OTPServices.SendOTPService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "OTP sent successfully!",
        data: result
    });
}));
const VerifyOTPController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield otp_service_1.OTPServices.VerifyOTPService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "OTP verified successfully!",
        data: result
    });
}));
exports.OTPControllers = {
    SendOTPController,
    VerifyOTPController
};
