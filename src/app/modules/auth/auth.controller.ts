/* eslint-disable @typescript-eslint/no-explicit-any */
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {Request, Response, NextFunction} from "express";
import {AuthServices} from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import {storeJwtAccessAndRefreshTokensInCookie} from "../../utils/setCookieFunction";
import {JwtPayload} from "jsonwebtoken";
import passport from "passport";
import {generateJWTAccessAndRefreshTokenFunction} from "../../utils/generateJWTAccessAndRefreshTokenFunction";





const loginWithCredentialsController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const loggedInUser = await AuthServices.loginWithCredentialsService(req.body);

        // To set the JWT access token and refresh token in the cookies
        storeJwtAccessAndRefreshTokensInCookie(res, loggedInUser);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully!",
            data: loggedInUser
        })
    }
)





const loginWithPassportCredentialsController = catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {

        passport.authenticate(
            "local",
            async (error: any, loggedInUser: any, info: any)=>{

                // First check if there is an error
                if (error){
                    // throw new AppError(httpStatus.UNAUTHORIZED, "User logged in failed due to " + info.message);     // ❌❌❌ Don't do this
                    // return new AppError(httpStatus.UNAUTHORIZED, "User logged in failed due to " + info.message);    // ❌❌❌ Don't do this
                    // next(error);                                                                                     // ❌❌❌ Don't do this
                    // return next(error);                                                                              // ✔️✔️✔️ Rather do this
                    return next(new AppError(httpStatus.UNAUTHORIZED, "User logged in failed! " + info.message)); // ✔️✔️✔️ Rather do this                                                       // ✔️✔️✔️ Rather do this
                }

                // Then check if the user is logged in or not
                if (!loggedInUser){
                    return next(new AppError(httpStatus.UNAUTHORIZED, "User login failed! " + info.message));
                }

                // console.log('Logged In User:- ', loggedInUser);

                // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
                // And then remove the password from the object
                // And then we'll return only the userFromDatabaseObj without the password field
                const loggedInUserObj = loggedInUser.toObject();
                delete loggedInUserObj.password

                // If the user is logged in, then create both JWT access token and refresh token for this user
                const thisUserTokens: { accessToken: string, refreshToken: string } = generateJWTAccessAndRefreshTokenFunction(loggedInUserObj);

                // To set the JWT access token and refresh token in the cookies
                storeJwtAccessAndRefreshTokensInCookie(res, thisUserTokens);

                // Finally send the response
                sendResponseFunction(res, {
                    statusCode: httpStatus.OK,
                    success: true,
                    message: "User logged in successfully!",
                    data: {
                        user: loggedInUserObj,
                        accessToken: thisUserTokens.accessToken,
                        refreshToken: thisUserTokens.refreshToken
                    }
                })
            }
        )(req, res, next);
    }
)
/* As we are using passport for authentication, the service layer will not be used here. Rather things will be handled in
the controller layer. */




const getNewAccessTokenController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const refreshTokenFromCookies: string = req.cookies.refreshToken;

        if (!refreshTokenFromCookies) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found in cookies!");
        }

        const newAccessToken = await AuthServices.getNewAccessTokenService(refreshTokenFromCookies);

        // To set the new JWT access token in the cookies
        storeJwtAccessAndRefreshTokensInCookie(res, newAccessToken);

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





const changePasswordController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const decodedToken = req.userToken as JwtPayload;
        const givenOldPassword = req.body.oldPassword as string;
        const givenNewPassword = req.body.newPassword as string;

        const changePasswordResult = await AuthServices.changePasswordService(decodedToken, givenOldPassword, givenNewPassword) as boolean;

        if (!changePasswordResult) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Password reset failed!");
        }

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password changed successfully!",
            data: null
        })
    }
)





const resetPasswordRequestController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await AuthServices.resetPasswordRequestService(req) as boolean;

        if (!result) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Password reset request failed!");
        }

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password reset request submitted successfully!",
            data: result
        })
    }
)





const resetPasswordFinalizationController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await AuthServices.resetPasswordFinalizationService(req) as boolean;

        if (!result) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Password reset failed!");
        }

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password reset completed successfully!",
            data: result
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
    loginWithPassportCredentialsController,
    getNewAccessTokenController,
    logoutController,
    changePasswordController,
    resetPasswordRequestController,
    resetPasswordFinalizationController,
    googleCallbackController
};
