import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { createCODOrder, createOrder, getAllOrders, getOrders } from "../controllers/order.controllers.ts";

const router = express.Router();

router.route("/create-order").post(authMiddleware, createOrder);
router.route("/create-cod-order").post(authMiddleware, createCODOrder);
router.route("/get-all-orders").get(authMiddleware, getAllOrders);
router.route("/get-orders").get(authMiddleware, getOrders);

export default router;