import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {Request, Response, NextFunction} from "express";
import {AuthServices} from "./auth.service";



const loginWithCredentialsController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const loggedInUser = await AuthServices.loginWithCredentialsService(req.body);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully!",
            data: loggedInUser
        })
    }
)



// Named exports
export const AuthControllers = {
    loginWithCredentialsController
};
