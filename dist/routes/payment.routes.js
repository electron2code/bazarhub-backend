import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { initiatePayment, verifyPayment } from "../controllers/payment.controllers.js";
const router = express.Router();
router.route("/create").post(authMiddleware, initiatePayment);
router.route("/verify").post(authMiddleware, verifyPayment);
export default router;
