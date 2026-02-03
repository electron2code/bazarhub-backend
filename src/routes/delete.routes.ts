import express from "express";
import { deleteCategoryThumbnail } from "../controllers/delete.controllers.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.route("/category-thumbnail").delete(authMiddleware, deleteCategoryThumbnail);

export default router;