import { Router } from "express";
import {
  createPayroll,
  getPayrollById,
  getAllPayrolls,
  updatePayroll,
  deletePayroll,
} from "../controllers/payrollController";

const router = Router();

// ✅ Generate payroll for an employee (auto-calculation based on attendance/leave etc.)
router.post("/generate", createPayroll);

// ✅ Get payroll by ID
router.get("/:id", getPayrollById);

// ✅ Get all payrolls (admin view)
router.get("/", getAllPayrolls);

// ✅ Update payroll record
router.put("/:id", updatePayroll);

// ✅ Delete payroll record
router.delete("/:id", deletePayroll);

export default router;
