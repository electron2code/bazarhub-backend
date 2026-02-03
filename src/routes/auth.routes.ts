import express from "express";
import { getLoggedInUser, login, logout, refreshAccessToken, register, verifyEmail } from "../controllers/auth.controllers.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-email").get(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/refresh-token").post(authMiddleware, refreshAccessToken);
router.route("/profile").get(authMiddleware, getLoggedInUser);
// router.route("/google").post();

export default router;
