import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from "../controllers/Employee.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/Validate.middlewere";
import { 
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdSchema
} from "../validations/employee.validation";
import upload from "../middleware/upload"; 

const router = express.Router();
router.post(
  "/",
  verifyToken,
  upload.single("photo"), // <-- ADD THIS HERE
  validateRequest(createEmployeeSchema),
  createEmployee
);

router.get("/", getAllEmployees);

router.get(
  "/:id",
  verifyToken,
  validateRequest(employeeIdSchema),
  getEmployeeById
);

router.put(
  "/:id",
  verifyToken,
  // validateRequest(updateEmployeeSchema),
  updateEmployee
);

router.delete(
  "/:id",
  verifyToken,
  validateRequest(employeeIdSchema),
  deleteEmployee
);

export default router;