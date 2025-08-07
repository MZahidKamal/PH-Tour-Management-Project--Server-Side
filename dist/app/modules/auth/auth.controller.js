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
exports.AuthControllers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookieFunction_1 = require("../../utils/setCookieFunction");
const passport_1 = __importDefault(require("passport"));
const generateJWTAccessAndRefreshTokenFunction_1 = require("../../utils/generateJWTAccessAndRefreshTokenFunction");
const loginWithCredentialsController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = yield auth_service_1.AuthServices.loginWithCredentialsService(req.body);
    // To set the JWT access token and refresh token in the cookies
    (0, setCookieFunction_1.storeJwtAccessAndRefreshTokensInCookie)(res, loggedInUser);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User logged in successfully!",
        data: loggedInUser
    });
}));
const loginWithPassportCredentialsController = (0, catchAsyncFunction_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (error, loggedInUser, info) => __awaiter(void 0, void 0, void 0, function* () {
        // First check if there is an error
        if (error) {
            // throw new AppError(httpStatus.UNAUTHORIZED, "User logged in failed due to " + info.message);     // ❌❌❌ Don't do this
            // return new AppError(httpStatus.UNAUTHORIZED, "User logged in failed due to " + info.message);    // ❌❌❌ Don't do this
            // next(error);                                                                                     // ❌❌❌ Don't do this
            // return next(error);                                                                              // ✔️✔️✔️ Rather do this
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User logged in failed! " + info.message)); // ✔️✔️✔️ Rather do this                                                       // ✔️✔️✔️ Rather do this
        }
        // Then check if the user is logged in or not
        if (!loggedInUser) {
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User login failed! " + info.message));
        }
        // console.log('Logged In User:- ', loggedInUser);
        // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
        // And then remove the password from the object
        // And then we'll return only the userFromDatabaseObj without the password field
        const loggedInUserObj = loggedInUser.toObject();
        delete loggedInUserObj.password;
        // If the user is logged in, then create both JWT access token and refresh token for this user
        const thisUserTokens = (0, generateJWTAccessAndRefreshTokenFunction_1.generateJWTAccessAndRefreshTokenFunction)(loggedInUserObj);
        // To set the JWT access token and refresh token in the cookies
        (0, setCookieFunction_1.storeJwtAccessAndRefreshTokensInCookie)(res, thisUserTokens);
        // Finally send the response
        (0, sendResponseFunction_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "User logged in successfully!",
            data: {
                user: loggedInUserObj,
                accessToken: thisUserTokens.accessToken,
                refreshToken: thisUserTokens.refreshToken
            }
        });
    }))(req, res, next);
}));
/* As we are using passport for authentication, the service layer will not be used here. Rather things will be handled in
the controller layer. */
const getNewAccessTokenController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenFromCookies = req.cookies.refreshToken;
    if (!refreshTokenFromCookies) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Refresh token not found in cookies!");
    }
    const newAccessToken = yield auth_service_1.AuthServices.getNewAccessTokenService(refreshTokenFromCookies);
    // To set the new JWT access token in the cookies
    (0, setCookieFunction_1.storeJwtAccessAndRefreshTokensInCookie)(res, newAccessToken);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "New access token created successfully!",
        data: newAccessToken
    });
}));
const logoutController = (0, catchAsyncFunction_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // To delete the JWT access token and refresh token from the database
    yield auth_service_1.AuthServices.logoutService(res);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User logged out successfully!",
        data: null
    });
}));
const resetPasswordController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.userToken;
    const givenOldPassword = req.body.oldPassword;
    const givenNewPassword = req.body.newPassword;
    const newPasswordSuccessful = yield auth_service_1.AuthServices.resetPasswordService(decodedToken, givenOldPassword, givenNewPassword);
    if (!newPasswordSuccessful) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Password reset failed!");
    }
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Password reset successfully!",
        data: null
    });
}));
const googleCallbackController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.AuthServices.googleCallbackService(req, res);
    // We don't need to send a response, we just need to redirect the user to the specified URL
    /*sendResponseFunction(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post google callback redirect successfully!",
        data: null
    })*/
}));
// Named exports
exports.AuthControllers = {
    loginWithCredentialsController,
    loginWithPassportCredentialsController,
    getNewAccessTokenController,
    logoutController,
    resetPasswordController,
    googleCallbackController
};
