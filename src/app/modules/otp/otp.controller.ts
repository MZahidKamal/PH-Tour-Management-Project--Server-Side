import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {NextFunction, Request, Response} from "express";
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import {OTPServices} from "./otp.service";





const SendOTPController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await OTPServices.SendOTPService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "OTP sent successfully!",
            data: result
        })
    }
)





const VerifyOTPController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await OTPServices.VerifyOTPService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "OTP verified successfully!",
            data: result
        })
    }
)





export const OTPControllers = {
    SendOTPController,
    VerifyOTPController
};
