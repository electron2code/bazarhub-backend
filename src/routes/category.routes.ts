import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories, bulkDeleteCategories } from "../controllers/category.controllers.js";

const router = express.Router();

// router.route("/create").post(authMiddleware, createProduct);
router.route("/create-category").post(authMiddleware, createCategory);
router.route("/update-category").put(authMiddleware, updateCategory);
router.route("/delete-category").delete(authMiddleware, deleteCategory);
router.route("/bulk-delete-categories").delete(authMiddleware, bulkDeleteCategories);
router.route("/get-category").get(getCategory);
router.route("/get-all-categories").get(getAllCategories);

export default router;
