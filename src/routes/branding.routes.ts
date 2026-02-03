import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { deleteBrandingLogo, getBranding, updateBranding, updateBrandingLogo } from "../controllers/branding.controllers.ts";

const router = express.Router();


router.route("/").get(getBranding);
router.route("/update-branding").post(authMiddleware, updateBranding);
router.route("/update-branding/logo").post(authMiddleware, updateBrandingLogo);
router.route("/delete-branding/logo").delete(authMiddleware, deleteBrandingLogo);


export default router;