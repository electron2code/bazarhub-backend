import { ApiError } from "../utils/apiError.js";
export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    console.error("🔥 Error:", err);
    res.status(statusCode).json({
        success: false,
        message,
    });
};
