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
exports.generateNewAccessTokenFromRefreshTokenFunction = exports.verifyRefreshTokenFunction = exports.generateJWTAccessAndRefreshTokenFunction = exports.generateJWTTokenFunction = void 0;
const envConfig_1 = __importDefault(require("../config/envConfig"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const generateJWTTokenFunction = (jwtPayload) => {
    const jwtSecret = envConfig_1.default.jwt_secret;
    const jwtExpiration = envConfig_1.default.jwt_expires_in;
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    return jwtToken;
};
exports.generateJWTTokenFunction = generateJWTTokenFunction;
const generateRefreshJWTTokenFunction = (jwtPayload) => {
    const jwtSecret = envConfig_1.default.refresh_jwt_secret;
    const jwtExpiration = envConfig_1.default.refresh_jwt_expires_in;
    const refreshJwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    return refreshJwtToken;
};
const generateJWTAccessAndRefreshTokenFunction = (userFromDatabase) => {
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const accessToken = (0, exports.generateJWTTokenFunction)(jwtPayload);
    const refreshToken = generateRefreshJWTTokenFunction(jwtPayload);
    return { accessToken, refreshToken };
};
exports.generateJWTAccessAndRefreshTokenFunction = generateJWTAccessAndRefreshTokenFunction;
const verifyRefreshTokenFunction = (refreshToken) => {
    const verifiedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, envConfig_1.default.refresh_jwt_secret);
    return verifiedRefreshToken;
};
exports.verifyRefreshTokenFunction = verifyRefreshTokenFunction;
const generateNewAccessTokenFromRefreshTokenFunction = (refreshTokenFromCookies) => __awaiter(void 0, void 0, void 0, function* () {
    // First, verify the refresh token and get the decoded token
    const verifyRefreshToken = (0, exports.verifyRefreshTokenFunction)(refreshTokenFromCookies);
    // Then check if the user with the provided email exists in the database
    const userFromDatabase = yield user_model_1.default.findOne({ email: verifyRefreshToken.email });
    if (!userFromDatabase) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // If the user is found, then check if the user is active or not
    if (userFromDatabase.isActive === user_interface_1.IsActiveEnum.INACTIVE || userFromDatabase.isActive === user_interface_1.IsActiveEnum.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, `User is ${userFromDatabase.isActive.toLowerCase()}!`);
    }
    // Then check if the user is deleted or not
    if (userFromDatabase.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User is deleted!');
    }
    // Now the userFromDatabase is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    const userFromDatabaseObj = userFromDatabase.toObject();
    delete userFromDatabaseObj.password;
    // After that create new JWT access token for this user
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const newAccessToken = (0, exports.generateJWTTokenFunction)(jwtPayload);
    return newAccessToken;
});
exports.generateNewAccessTokenFromRefreshTokenFunction = generateNewAccessTokenFromRefreshTokenFunction;
