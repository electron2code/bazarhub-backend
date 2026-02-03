import jwt from "jsonwebtoken";

export const generateAccessAndRefreshToken = (userId: string) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
    const ACCESS_TOKEN_EXPIRY = Number(process.env.ACCESS_TOKEN_EXPIRY);
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
    const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);

    const accessTokenMaxAge = ACCESS_TOKEN_EXPIRY * 1000;
    const refreshTokenMaxAge = REFRESH_TOKEN_EXPIRY * 1000;

    const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    },)


    const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge };
};