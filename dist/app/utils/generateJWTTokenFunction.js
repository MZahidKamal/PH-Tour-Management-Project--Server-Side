"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBothTokensFunction = void 0;
const envConfig_1 = __importDefault(require("../config/envConfig"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWTTokenFunction = (jwtPayload) => {
    const jwtSecret = envConfig_1.default.jwt_secret;
    const jwtExpiration = envConfig_1.default.jwt_expires_in;
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    return jwtToken;
};
const generateRefreshJWTTokenFunction = (jwtPayload) => {
    const jwtSecret = envConfig_1.default.refresh_jwt_secret;
    const jwtExpiration = envConfig_1.default.refresh_jwt_expires_in;
    const refreshJwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    return refreshJwtToken;
};
const generateBothTokensFunction = (userFromDatabase) => {
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const accessToken = generateJWTTokenFunction(jwtPayload);
    const refreshToken = generateRefreshJWTTokenFunction(jwtPayload);
    return { accessToken, refreshToken };
};
exports.generateBothTokensFunction = generateBothTokensFunction;
