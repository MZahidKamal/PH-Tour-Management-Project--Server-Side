"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJwtAccessAndRefreshTokensInCookie = void 0;
const storeJwtAccessAndRefreshTokensInCookie = (res, authTokens) => {
    if (authTokens.accessToken) {
        // To set the JWT access token in the cookies
        const accessToken = authTokens.accessToken;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
    }
    if (authTokens.refreshToken) {
        // To set the JWT refresh token in the cookies
        const refreshToken = authTokens.refreshToken;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
exports.storeJwtAccessAndRefreshTokensInCookie = storeJwtAccessAndRefreshTokensInCookie;
