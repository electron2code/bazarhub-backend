import express from "express";
import upload from "../middlewares/multer.middleware.js";
import { categoryThumbnail, productThumbnail, deleteProductThumbnail, createBrandingLogo, createBannerImage, deleteBannerImage } from "../controllers/upload.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../db/db.js";
const router = express.Router();
router.route("/category-thumbnail").post(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, upload.single("category-thumbnail"), categoryThumbnail);
router.route("/product-thumbnail").post(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, upload.single("product-thumbnail"), productThumbnail);
router.route("/product-thumbnail").delete(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, deleteProductThumbnail);
router.route("/branding-logo").post(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, upload.single("branding-logo"), createBrandingLogo);
router.route("/banner-image").post(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, upload.single("banner-image"), createBannerImage);
router.route("/banner-image").delete(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    next();
}, deleteBannerImage);
export default router;
