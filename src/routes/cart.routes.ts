import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { addToCart, clearCart, getCartItems, removeCartItem, updateCartItemQuantity } from "../controllers/cart.controllers.ts";

const router = express.Router();

router.route("/").get(authMiddleware, getCartItems);
router.route("/add").post(authMiddleware, addToCart);
router.route("/remove").post(authMiddleware, removeCartItem);
router.route("/update").post(authMiddleware, updateCartItemQuantity);
router.route("/clear").delete(authMiddleware, clearCart);

export default router;
