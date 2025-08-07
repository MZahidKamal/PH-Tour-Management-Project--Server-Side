import { Response } from 'express';





interface AuthCookieInterface {
    accessToken ?: string;
    refreshToken ?: string;
}





export const storeJwtAccessAndRefreshTokensInCookie = (res: Response, authTokens: AuthCookieInterface) => {

    if (authTokens.accessToken) {

        // To set the JWT access token in the cookies
        const accessToken = authTokens.accessToken as string;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
    }

    if (authTokens.refreshToken) {

        // To set the JWT refresh token in the cookies
        const refreshToken = authTokens.refreshToken as string;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
