import { Response } from 'express';





interface AuthCookieInterface {
    accessToken ?: string;
    refreshToken ?: string;
}





export const storeJwtAccessAndRefreshTokenInCookies = (res: Response, authToken: AuthCookieInterface) => {

    if (authToken.accessToken) {

        // To set the JWT access token in the cookies
        const accessToken = authToken.accessToken as string;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
    }

    if (authToken.refreshToken) {

        // To set the JWT refresh token in the cookies
        const refreshToken = authToken.refreshToken as string;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
