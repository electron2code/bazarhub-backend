import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let accessToken = "";
    if (req.cookies.accessToken) {
        accessToken = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
        accessToken = req.headers.authorization.split("Bearer ")[1] as string;
    }

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = (jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload);
    if (decoded.id) {
        req.user = decoded;
        next();
    } else {
        throw new ApiError(401, "Unauthorized");
    }
});