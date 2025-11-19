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
exports.OTPServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const redis_config_1 = require("../../config/redis.config");
const nodemailer_config_1 = __importDefault(require("../../config/nodemailer.config"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = __importDefault(require("../user/user.model"));
const user_interface_1 = require("../user/user.interface");
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const generateADynamicOTPFunction_1 = require("../../utils/generateADynamicOTPFunction");
const SendOTPService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll destructure the payload to get the name and email from the request body'
    const { name, email } = payload.body;
    // The we'll check if the email provided is exists in the database or not'
    const isUserExists = yield user_model_1.default.findOne({ email: email });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Then we'll check the user's current status of isDeleted, isActive and isVerified fields''
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted!");
    }
    if (isUserExists.isActive === user_interface_1.IsActiveEnum.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not active!");
    }
    if (isUserExists.isActive === user_interface_1.IsActiveEnum.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is blocked!");
    }
    if (isUserExists.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already verified!");
    }
    // Then we'll generate a dynamic OTP of length 6 using the generateADynamicOTP function'
    const dynamicOTP = (0, generateADynamicOTPFunction_1.generateADynamicOTP)();
    // Now we'll create a Redis key of the format 'otp:{email}' using the email from the request body'
    const redisKey = `otp:${email}`;
    // Then we'll get the OTP expiry time from the environment variables'
    const OTP_EXPIRY_TIME = Number(envConfig_1.default.otp_expiry_time) * 60 * 1000; // Minutes in milliseconds
    // Then, we'll set the OTP in Redis with a key of the format 'otp:{email}' and an expiration time of 10 minutes'
    const redisResult = yield redis_config_1.redisClient.set(redisKey, dynamicOTP, {
        expiration: {
            type: 'PX',
            value: OTP_EXPIRY_TIME
        }
    });
    if (redisResult !== 'OK') {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "OTP Sending Failed due to Redis Error!");
    }
    // Then, we'll send an email to the user with the dynamic OTP and the expiry time of 10 minutes'
    const emailResult = yield (0, nodemailer_config_1.default)({
        targetEmail: email,
        emailSubject: "OTP Verification - PH Tour Management Project",
        emailTemplateName: 'otpSendingEmail.template.ejs',
        emailTemplateData: { name: name, email: email, otp: dynamicOTP, expiryTime: OTP_EXPIRY_TIME / 60000 },
        attachments: []
    });
    if (!(emailResult === null || emailResult === void 0 ? void 0 : emailResult.messageId)) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "OTP Sending Failed due to Email Error!");
    }
    // Finally, returning only true, because we don't need to return anything at all'
    return true;
});
const VerifyOTPService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll destructure the payload to get the email and OTP from the request body and then trim and stringify them'
    const email = String(payload.body.email).toLowerCase().trim();
    const otp = String(payload.body.otp).trim();
    // Now we'll check if the OTP provided matches the OTP stored in Redis for the given email'
    const redisKey = `otp:${email}`;
    const redisResult = yield redis_config_1.redisClient.get(redisKey);
    if (!redisResult || redisResult !== otp) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid OTP!");
    }
    // Then we'll check if the email provided is exists in the database or not'
    const isUserExists = yield user_model_1.default.findOne({ email: email });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Then we'll check the user's current status of isDeleted, isActive and isVerified fields'
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted!");
    }
    if (isUserExists.isActive === user_interface_1.IsActiveEnum.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not active!");
    }
    if (isUserExists.isActive === user_interface_1.IsActiveEnum.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is blocked!");
    }
    if (isUserExists.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already verified!");
    }
    // Then we'll update the isVerified field of the user to true in the database'
    const updateResult = yield user_model_1.default.findByIdAndUpdate(isUserExists._id, { isVerified: true }, {
        new: true,
        runValidators: true,
        projection: {
            isVerified: 1,
        }
    });
    if (!updateResult) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "OTP Verification Failed due to Database Error!");
    }
    // Finally, we'll delete the OTP from Redis after successful verification'
    const redisDeleteResult = yield redis_config_1.redisClient.del(redisKey);
    if (!redisDeleteResult) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "OTP Verification Failed due to Redis Error!");
    }
    // Finally, returning the isVerified field of the updated user'
    return updateResult === null || updateResult === void 0 ? void 0 : updateResult.isVerified;
});
exports.OTPServices = {
    SendOTPService,
    VerifyOTPService
};
