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
exports.AuthServices = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateJWTAccessAndRefreshTokenFunction_1 = require("../../utils/generateJWTAccessAndRefreshTokenFunction");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const setCookieFunction_1 = require("../../utils/setCookieFunction");
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const nodemailer_config_1 = __importDefault(require("../../config/nodemailer.config"));
const loginWithCredentialsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring the payload
    const { email, password } = payload;
    // Checking the user with the provided email exists in the database
    const userFromDatabase = yield user_model_1.default.findOne({ email });
    if (!userFromDatabase) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // If the user is found, then check if the password provided is correct
    const isPasswordValid = yield bcryptjs_1.default.compare(password, userFromDatabase.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid password!");
    }
    // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    // And then we'll return only the userFromDatabaseObj without the password field
    const userFromDatabaseObj = userFromDatabase.toObject();
    delete userFromDatabaseObj.password;
    // After that create both JWT access token and refresh token for this user
    const thisUserTokens = (0, generateJWTAccessAndRefreshTokenFunction_1.generateJWTAccessAndRefreshTokenFunction)(userFromDatabase);
    // Finally, returning the userFromDatabaseObj without the password field, and the JWT access token and refresh token
    return {
        user: userFromDatabaseObj,
        accessToken: thisUserTokens.accessToken,
        refreshToken: thisUserTokens.refreshToken
    };
});
const getNewAccessTokenService = (refreshTokenFromCookies) => __awaiter(void 0, void 0, void 0, function* () {
    // Create new JWT access token using the refresh token
    const newAccessToken = yield (0, generateJWTAccessAndRefreshTokenFunction_1.generateNewAccessTokenFromRefreshTokenFunction)(refreshTokenFromCookies);
    // Then returning the new JWT access token
    return {
        accessToken: newAccessToken
    };
});
const logoutService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    // Then returning only true, because we don't need to return anything at all
    return true;
});
const changePasswordService = (decodedToken, givenOldPassword, givenNewPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // First fetch the user from the database
    const userFromDatabase = yield user_model_1.default.findOne({ email: decodedToken.email });
    const oldPasswordFromDatabase = userFromDatabase.password;
    // The, we'll check if the user is trying to change their own password or not
    if (decodedToken.email !== userFromDatabase.email) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to change this user's password!");
    }
    if (decodedToken.role !== userFromDatabase.role) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to change this user's password!");
    }
    // Then check if the old password provided is correct or not
    const isPasswordValid = yield bcryptjs_1.default.compare(givenOldPassword, oldPasswordFromDatabase);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "old password does not match!");
    }
    // Then hash the new password
    const hashedNewPassword = yield bcryptjs_1.default.hash(givenNewPassword, Number(envConfig_1.default.bcrypt_salt_rounds));
    // Then save the new password in the database
    yield user_model_1.default.findByIdAndUpdate({ _id: userFromDatabase._id }, { password: hashedNewPassword });
    // Then returning only true, because we don't need to return confidential password information
    return true;
});
const resetPasswordRequestService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First we'll destructure the payload to get the email from the request body
    const { email } = payload.body;
    // Now we'll check if the email provided exists in the database
    const isUserExists = yield user_model_1.default.findOne({ email });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Now we'll check the user's isDeleted, isActive and isVerified fields to make sure that the user is not deleted, active and verified
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted!");
    }
    else if (!isUserExists.isActive) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not active!");
    }
    else if (!isUserExists.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified!");
    }
    // Now we'll generate a jwt token with the user's email and will make sure that the token expires in 10 minutes'
    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role
    };
    const jwtSecret = envConfig_1.default.jwt_secret;
    const jwtExpiration = "10m";
    const tempResetPasswordJWTToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    // Now we'll generate a reset password link with the user email and the tempResetPasswordJWTToken and the frontend URL
    const resetPasswordLink = `${envConfig_1.default.frontend_url}/reset-password-finalization?email=${email}&token=${tempResetPasswordJWTToken}`;
    (0, consolePrintFunction_1.consolePrint)("Reset Password Link: ", resetPasswordLink);
    // Now we'll send the reset password link to the user's email using the nodemailer
    yield (0, nodemailer_config_1.default)({
        targetEmail: email,
        emailSubject: "Reset Password Link - PH Tour",
        emailTemplateName: 'forgetPasswordEmail.template.ejs',
        emailTemplateData: {
            name: isUserExists.name,
            resetUILink: resetPasswordLink
        },
        attachments: []
    });
    // Then returning only true, because we don't need to return confidential password information
    return true;
});
const resetPasswordFinalizationService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First we'll destructure the payload to get the email, new password and the decoded token
    const { email, newPassword } = payload.body;
    const decodedToken = payload.userToken;
    // Now we'll check if the email provided matches the decoded token's email'
    if (decodedToken.email !== email) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Email does not match!");
    }
    // The we'll check if the user exists in the database'
    const userFromDatabase = yield user_model_1.default.findOne({ email: email });
    if (!userFromDatabase) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Then hash the new password
    const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, Number(envConfig_1.default.bcrypt_salt_rounds));
    // Then save the new password in the database
    const updatePasswordResult = yield user_model_1.default.findByIdAndUpdate({ _id: userFromDatabase._id }, { password: hashedNewPassword });
    if (!updatePasswordResult) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Password reset failed!");
    }
    // Then returning only true, because we don't need to return confidential password information
    return true;
});
const googleCallbackService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // First authenticate the user with Google OAuth Strategy
    //passport.authenticate('google', { failureRedirect: '/auth/google' })(req, res, next);
    let redirectToUrl = (req.query.state ? req.query.state : "");
    if (redirectToUrl.startsWith('/')) {
        redirectToUrl = redirectToUrl.slice(1);
    }
    // After that get the user from the request
    const userFromGoogleStrategy = req.user;
    if (!userFromGoogleStrategy) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Google authentication failed! User not found!");
    }
    // After that create both JWT access token and refresh token for this user
    const thisUserTokens = (0, generateJWTAccessAndRefreshTokenFunction_1.generateJWTAccessAndRefreshTokenFunction)(userFromGoogleStrategy);
    // To set the JWT access token and refresh token in the cookies
    (0, setCookieFunction_1.storeJwtAccessAndRefreshTokensInCookie)(res, thisUserTokens);
    // We don't need to send a response, we just need to redirect the user to the specified URL
    res.redirect(`${envConfig_1.default.frontend_url}/${redirectToUrl}`);
    return true;
});
// Named exports
exports.AuthServices = {
    loginWithCredentialsService,
    getNewAccessTokenService,
    logoutService,
    changePasswordService,
    resetPasswordRequestService,
    resetPasswordFinalizationService,
    googleCallbackService
};
