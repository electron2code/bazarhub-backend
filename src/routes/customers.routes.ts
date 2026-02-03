import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCustomers, updateCustomerType } from "../controllers/customer.controllers.js";

const router = express.Router();

router.route("/").get(authMiddleware, getCustomers);
router.route("/update-type").post(authMiddleware, updateCustomerType)

export default router;