import {JwtPayload, SignOptions} from "jsonwebtoken";
import envConfig from "../config/envConfig";
import jwt from "jsonwebtoken";
import {IsActiveEnum, UserInterface} from "../modules/user/user.interface";
import UserModel from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";





export const generateJWTTokenFunction = (jwtPayload: JwtPayload) => {

    const jwtSecret = envConfig.jwt_secret as string;
    const jwtExpiration = envConfig.jwt_expires_in as string;

    const jwtToken: string = jwt.sign(jwtPayload as JwtPayload, jwtSecret as string, {expiresIn: jwtExpiration} as SignOptions);

    return jwtToken;
}





const generateRefreshJWTTokenFunction = (jwtPayload: JwtPayload) => {

    const jwtSecret = envConfig.refresh_jwt_secret as string;
    const jwtExpiration = envConfig.refresh_jwt_expires_in as string;

    const refreshJwtToken: string = jwt.sign(jwtPayload as JwtPayload, jwtSecret as string, {expiresIn: jwtExpiration} as SignOptions);

    return refreshJwtToken;
}





export const generateJWTAccessAndRefreshTokenFunction = (userFromDatabase: Partial<UserInterface>) => {

    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };

    const accessToken = generateJWTTokenFunction(jwtPayload);
    const refreshToken = generateRefreshJWTTokenFunction(jwtPayload);

    return {accessToken, refreshToken};
}





export const verifyRefreshTokenFunction = (refreshToken: string) => {
    const verifiedRefreshToken = jwt.verify(refreshToken, envConfig.refresh_jwt_secret as string)
    return verifiedRefreshToken
};





export const generateNewAccessTokenFromRefreshTokenFunction = async (refreshTokenFromCookies: string) => {

    // First, verify the refresh token and get the decoded token
    const verifyRefreshToken = verifyRefreshTokenFunction(refreshTokenFromCookies) as JwtPayload;

    // Then check if the user with the provided email exists in the database
    const userFromDatabase = await UserModel.findOne({email: verifyRefreshToken.email});
    if (!userFromDatabase) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // If the user is found, then check if the user is active or not
    if (userFromDatabase.isActive === IsActiveEnum.INACTIVE || userFromDatabase.isActive === IsActiveEnum.BLOCKED) {
        throw new AppError(httpStatus.UNAUTHORIZED, `User is ${userFromDatabase.isActive.toLowerCase()}!`);
    }

    // Then check if the user is deleted or not
    if (userFromDatabase.isDeleted){
        throw new AppError(httpStatus.UNAUTHORIZED, 'User is deleted!');
    }

    // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    const userFromDatabaseObj = userFromDatabase.toObject();
    delete userFromDatabaseObj.password

    // After that create new JWT access token for this user
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const newAccessToken = generateJWTTokenFunction(jwtPayload);
    return newAccessToken;
};
