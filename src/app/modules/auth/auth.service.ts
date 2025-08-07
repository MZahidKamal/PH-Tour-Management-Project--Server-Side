import {UserInterface} from "../user/user.interface";
import UserModel from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {generateJWTAccessAndRefreshTokenFunction, generateNewAccessTokenFromRefreshTokenFunction} from "../../utils/generateJWTAccessAndRefreshTokenFunction";
import {JwtPayload} from "jsonwebtoken";
import envConfig from "../../config/envConfig";
import {storeJwtAccessAndRefreshTokensInCookie} from "../../utils/setCookieFunction";
import {Request, Response} from "express";





const loginWithCredentialsService = async (payload: Partial<UserInterface>) => {

    // Destructuring the payload
    const {email, password} = payload;

    // Checking the user with the provided email exists in the database
    const userFromDatabase = await UserModel.findOne({email});
    if (!userFromDatabase) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // If the user is found, then check if the password provided is correct
    const isPasswordValid = await bcrypt.compare(password as string, userFromDatabase.password as string);
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password!");
    }

    // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    // And then we'll return only the userFromDatabaseObj without the password field
    const userFromDatabaseObj = userFromDatabase.toObject();
    delete userFromDatabaseObj.password

    // After that create both JWT access token and refresh token for this user
    const thisUserTokens: { accessToken: string, refreshToken: string } = generateJWTAccessAndRefreshTokenFunction(userFromDatabase);

    // Finally, returning the userFromDatabaseObj without the password field, and the JWT access token and refresh token
    return {
        user: userFromDatabaseObj,
        accessToken: thisUserTokens.accessToken,
        refreshToken: thisUserTokens.refreshToken
    };
}





const getNewAccessTokenService = async (refreshTokenFromCookies: string) => {

    // Create new JWT access token using the refresh token
    const newAccessToken = await generateNewAccessTokenFromRefreshTokenFunction(refreshTokenFromCookies);

    // Then returning the new JWT access token
    return {
        accessToken: newAccessToken
    };
}





const logoutService = async (res: Response) => {

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
}





const resetPasswordService = async (decodedToken: JwtPayload, givenOldPassword: string, givenNewPassword: string) => {

    // First fetch the user from the database
    const userFromDatabase = await UserModel.findOne({email: decodedToken.email}) as UserInterface;
    const oldPasswordFromDatabase = userFromDatabase.password as string;

    // Then check if the old password provided is correct or not
    const isPasswordValid = await bcrypt.compare(givenOldPassword, oldPasswordFromDatabase) as boolean;
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "old password does not match!");
    }

    // Then hash the new password
    const hashedNewPassword = await bcrypt.hash(givenNewPassword, Number(envConfig.bcrypt_salt_rounds as string)) as string;

    // Then save the new password in the database
    await UserModel.findByIdAndUpdate({_id: userFromDatabase._id}, {password: hashedNewPassword});

    // Then returning only true, because we don't need to return confidential password information
    return true;
}





const googleCallbackService = async (req: Request, res: Response) => {

    // First authenticate the user with Google OAuth Strategy
    //passport.authenticate('google', { failureRedirect: '/auth/google' })(req, res, next);

    let redirectToUrl: string = (req.query.state ? req.query.state : "") as string;
    if (redirectToUrl.startsWith('/')) {
        redirectToUrl = redirectToUrl.slice(1);
    }


    // After that get the user from the request
    const userFromGoogleStrategy = req.user as Partial<UserInterface>;

    if (!userFromGoogleStrategy) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Google authentication failed! User not found!");
    }

    // After that create both JWT access token and refresh token for this user
    const thisUserTokens: { accessToken: string, refreshToken: string } = generateJWTAccessAndRefreshTokenFunction(userFromGoogleStrategy);

    // To set the JWT access token and refresh token in the cookies
    storeJwtAccessAndRefreshTokensInCookie(res, thisUserTokens);

    // We don't need to send a response, we just need to redirect the user to the specified URL
    res.redirect(`${envConfig.frontend_url as string}/${redirectToUrl}`);
    return true;
}





// Named exports
export const AuthServices = {
    loginWithCredentialsService,
    getNewAccessTokenService,
    logoutService,
    resetPasswordService,
    googleCallbackService
}
