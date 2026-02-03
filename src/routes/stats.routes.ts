import express from "express";
import { getDashboardStats } from "../controllers/stats.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../db/db.js";

const router = express.Router();

router.route("/dashboard").get(authMiddleware, async (req, res, next) => {
    try {
        const id = (req as any).user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user.role !== "ADMIN") {
            throw new ApiError(403, "Unauthorized");
        }

        next();
    } catch (error) {
        res.status(500).json(new ApiResponse(500, "Internal server error", error));
    }
}, getDashboardStats);

export default router;