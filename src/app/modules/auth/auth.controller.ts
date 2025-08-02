import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {Request, Response, NextFunction} from "express";
import {AuthServices} from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import {storeJwtAccessAndRefreshTokenInCookies} from "../../utils/setCookieFunction";
import {JwtPayload} from "jsonwebtoken";





const loginWithCredentialsController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const loggedInUser = await AuthServices.loginWithCredentialsService(req.body);

        // To set the JWT access token and refresh token in the cookies
        storeJwtAccessAndRefreshTokenInCookies(res, loggedInUser);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully!",
            data: loggedInUser
        })
    }
)





const getNewAccessTokenController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const refreshTokenFromCookies: string = req.cookies.refreshToken;

        if (!refreshTokenFromCookies) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found in cookies!");
        }

        const newAccessToken = await AuthServices.getNewAccessTokenService(refreshTokenFromCookies);

        // To set the new JWT access token in the cookies
        storeJwtAccessAndRefreshTokenInCookies(res, newAccessToken);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "New access token created successfully!",
            data: newAccessToken
        })
    }
)





const logoutController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        // To delete the JWT access token and refresh token from the database
        await AuthServices.logoutService(res);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged out successfully!",
            data: null
        })
    }
)





const resetPasswordController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const decodedToken = req.userToken as JwtPayload;
        const givenOldPassword = req.body.oldPassword as string;
        const givenNewPassword = req.body.newPassword as string;

        const newPasswordSuccessful = await AuthServices.resetPasswordService(decodedToken, givenOldPassword, givenNewPassword) as boolean;

        if (!newPasswordSuccessful) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Password reset failed!");
        }

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password reset successfully!",
            data: null
        })
    }
)





const googleCallbackController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction ) => {

        await AuthServices.googleCallbackService(req, res);

        // We don't need to send a response, we just need to redirect the user to the specified URL
        /*sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Post google callback redirect successfully!",
            data: null
        })*/
    }
)





// Named exports
export const AuthControllers = {
    loginWithCredentialsController,
    getNewAccessTokenController,
    logoutController,
    resetPasswordController,
    googleCallbackController
};
