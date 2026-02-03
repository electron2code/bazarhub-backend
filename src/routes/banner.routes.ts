import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { createBanner, deleteBanner, getBanners, updateBanner } from "../controllers/banner.controllers.ts";

const router = express.Router();

router.route("/").get(getBanners);
router.route("/create-banner").post(authMiddleware, createBanner);
router.route("/update-banner").put(authMiddleware, updateBanner);
router.route("/delete-banner").delete(authMiddleware, deleteBanner);

export default router;