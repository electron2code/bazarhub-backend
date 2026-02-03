import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { addDeliveryPersonnel, deleteDeliveryPersonnel, getDeliveryPersonnels, updateDeliveryPersonnel } from "../controllers/deliveryPersonnel.controllers.ts";

const router = express.Router();

router.route("/personnel").get(authMiddleware, getDeliveryPersonnels);
router.route("/add-personnel").post(authMiddleware, addDeliveryPersonnel);
router.route("/update-personnel").put(authMiddleware, updateDeliveryPersonnel);
router.route("/delete-personnel").delete(authMiddleware, deleteDeliveryPersonnel);

export default router;