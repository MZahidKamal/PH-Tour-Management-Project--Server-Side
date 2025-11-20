"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJwtAccessAndRefreshTokensInCookie = void 0;
const envConfig_1 = __importDefault(require("../config/envConfig"));
const storeJwtAccessAndRefreshTokensInCookie = (res, authTokens) => {
    if (authTokens.accessToken) {
        // To set the JWT access token in the cookies
        const accessToken = authTokens.accessToken;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: envConfig_1.default.node_environment === 'production',
            sameSite: 'none',
        });
    }
    if (authTokens.refreshToken) {
        // To set the JWT refresh token in the cookies
        const refreshToken = authTokens.refreshToken;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: envConfig_1.default.node_environment === 'production',
            sameSite: 'none',
        });
    }
};
exports.storeJwtAccessAndRefreshTokensInCookie = storeJwtAccessAndRefreshTokensInCookie;
