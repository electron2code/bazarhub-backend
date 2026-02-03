import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { initiatePayment, verifyPayment } from "../controllers/payment.controllers.ts";

const router = express.Router();

router.route("/create").post(authMiddleware, initiatePayment);
router.route("/verify").post(authMiddleware, verifyPayment);


export default router;