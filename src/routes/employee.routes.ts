import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addEmployee, deleteEmployee, getEmployees, updateEmployee } from "../controllers/employee.controllers.js";

const router = express.Router();

router.route("/").get(authMiddleware, getEmployees);
router.route("/add-employee").post(authMiddleware, addEmployee);
router.route("/update-employee").put(authMiddleware, updateEmployee);
router.route("/delete-employee").delete(authMiddleware, deleteEmployee);

export default router;