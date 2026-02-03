import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createProduct, getProducts, deleteProduct, updateProduct } from "../controllers/product.controllers.js";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
const router = express.Router();
router.route("/create-product").post(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
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
}, createProduct);
// router.route("/update-product").put(authMiddleware, updateProduct);
router.route("/delete-product").delete(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
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
}, deleteProduct);
router.route("/update-product").put(authMiddleware, async (req, res, next) => {
    const id = req.user.id;
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
}, updateProduct);
router.route("/get-products").get(getProducts);
export default router;
