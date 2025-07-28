import {NextFunction, Request, Response} from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";
import envConfig from "../config/envConfig";



const jwtRoleVerificationMiddleware = (...allowedRoles: string[]) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        // First, check if the request is coming with a token or not
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token not found!");
        }

        // If the request is coming with a token, then verify it and check if it is valid or not
        const isBearerTokenVarified= jwt.verify(bearerToken as string, envConfig.jwt_secret) as JwtPayload;
        if (!isBearerTokenVarified) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token!");
        }

        // If the token is valid, then check if the user is authorized to perform this action or not
        const decodedToken = isBearerTokenVarified as JwtPayload;
        if (!allowedRoles.includes(decodedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to perform this action!");
        }

        // Now store the decoded token in the modified request so that it can be used in the everywhere in this project
        req.userToken = decodedToken;

        // If the user is authorized, then pass the request to the next middleware
        next();
    }
    catch (error) {
        next(error);
    }
}



export default jwtRoleVerificationMiddleware;
