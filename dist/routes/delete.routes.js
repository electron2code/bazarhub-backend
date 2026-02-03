import express from "express";
import { deleteCategoryThumbnail } from "../controllers/delete.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.route("/category-thumbnail").delete(authMiddleware, deleteCategoryThumbnail);
export default router;
