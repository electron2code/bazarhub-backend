import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { getCustomers, updateCustomerType } from "../controllers/customer.controllers.ts";

const router = express.Router();

router.route("/").get(authMiddleware, getCustomers);
router.route("/update-type").post(authMiddleware, updateCustomerType)

export default router;