/* eslint-disable @typescript-eslint/no-explicit-any */
import {redisClient} from "../../config/redis.config";
import sendAnEmailToTheUser from "../../config/nodemailer.config";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import UserModel from "../user/user.model";
import {IsActiveEnum} from "../user/user.interface";
import envConfig from "../../config/envConfig";
import {generateADynamicOTP} from "../../utils/generateADynamicOTPFunction";





const SendOTPService = async (payload: any) => {

    // First, we'll destructure the payload to get the name and email from the request body'
    const {name, email} = payload.body as { name: string; email: string };

    // The we'll check if the email provided is exists in the database or not'
    const isUserExists = await UserModel.findOne({email: email});
    if (!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Then we'll check the user's current status of isDeleted, isActive and isVerified fields''
    if (isUserExists.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
    }
    if (isUserExists.isActive === IsActiveEnum.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, "User is not active!");
    }
    if (isUserExists.isActive === IsActiveEnum.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked!");
    }
    if (isUserExists.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST, "User is already verified!");
    }

    // Then we'll generate a dynamic OTP of length 6 using the generateADynamicOTP function'
    const dynamicOTP = generateADynamicOTP();

    // Now we'll create a Redis key of the format 'otp:{email}' using the email from the request body'
    const redisKey = `otp:${email}`;

    // Then we'll get the OTP expiry time from the environment variables'
    const OTP_EXPIRY_TIME = Number(envConfig.otp_expiry_time) * 60 * 1000;     // Minutes in milliseconds

    // Then, we'll set the OTP in Redis with a key of the format 'otp:{email}' and an expiration time of 10 minutes'
    const redisResult = await redisClient.set(redisKey, dynamicOTP, {
        expiration: {
            type: 'PX',
            value: OTP_EXPIRY_TIME
        }
    });
    if (redisResult !== 'OK'){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "OTP Sending Failed due to Redis Error!");
    }

    // Then, we'll send an email to the user with the dynamic OTP and the expiry time of 10 minutes'
    const emailResult = await sendAnEmailToTheUser({
        targetEmail: email,
        emailSubject: "OTP Verification - PH Tour Management Project",
        emailTemplateName: 'otpSendingEmail.template.ejs',
        emailTemplateData: {name: name, email: email, otp: dynamicOTP, expiryTime: OTP_EXPIRY_TIME / 60000},
        attachments: []
    })
    if (!emailResult?.messageId){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "OTP Sending Failed due to Email Error!");
    }

    // Finally, returning only true, because we don't need to return anything at all'
    return true;
};





const VerifyOTPService = async (payload: any) => {

    // First, we'll destructure the payload to get the email and OTP from the request body and then trim and stringify them'
    const email = String(payload.body.email).toLowerCase().trim();
    const otp = String(payload.body.otp).trim();

    // Now we'll check if the OTP provided matches the OTP stored in Redis for the given email'
    const redisKey = `otp:${email}`;
    const redisResult = await redisClient.get(redisKey);
    if (!redisResult || redisResult !== otp){
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP!");
    }

    // Then we'll check if the email provided is exists in the database or not'
    const isUserExists = await UserModel.findOne({email: email});
    if (!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Then we'll check the user's current status of isDeleted, isActive and isVerified fields'
    if(isUserExists.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
    }
    if(isUserExists.isActive === IsActiveEnum.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, "User is not active!");
    }
    if(isUserExists.isActive === IsActiveEnum.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked!");
    }
    if(isUserExists.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST, "User is already verified!");
    }

    // Then we'll update the isVerified field of the user to true in the database'
    const updateResult = await UserModel.findByIdAndUpdate(
        isUserExists._id,
        {isVerified: true},
        {
            new: true,
            runValidators: true,
            projection: {
                isVerified: 1,
            }
        }
    );
    if (!updateResult){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "OTP Verification Failed due to Database Error!");
    }

    // Finally, we'll delete the OTP from Redis after successful verification'
    const redisDeleteResult = await redisClient.del(redisKey);
    if (!redisDeleteResult){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "OTP Verification Failed due to Redis Error!");
    }

    // Finally, returning the isVerified field of the updated user'
    return updateResult?.isVerified;
};





export const OTPServices = {
    SendOTPService,
    VerifyOTPService
};
