"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJwtAccessAndRefreshTokenInCookies = void 0;
const storeJwtAccessAndRefreshTokenInCookies = (res, authToken) => {
    if (authToken.accessToken) {
        // To set the JWT access token in the cookies
        const accessToken = authToken.accessToken;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
    }
    if (authToken.refreshToken) {
        // To set the JWT refresh token in the cookies
        const refreshToken = authToken.refreshToken;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
exports.storeJwtAccessAndRefreshTokenInCookies = storeJwtAccessAndRefreshTokenInCookies;
