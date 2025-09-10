import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Create Payroll
export const createPayroll = async (req: Request, res: Response) => {
  try {
    const { employeeId, baseSalary, allowances, deductions, advancePayment, attendanceId } = req.body;

    if (!employeeId || !baseSalary) {
      return res.status(400).json({ message: "Employee ID and Base Salary are required" });
    }

    // Calculate net salary
    const netSalary = baseSalary + (allowances || 0) - (deductions || 0) - (advancePayment || 0);

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        baseSalary,
        allowances,
        deductions,
        advancePayment,
        netSalary,
        attendanceId: attendanceId || null,
      },
    });

    return res.status(201).json({
      message: "Payroll created successfully",
      payroll,
    });
  } catch (error) {
    console.error("Error creating payroll:", error);
    return res.status(500).json({ message: "Payroll creation failed", error: error.message || error });
  }
};

// ✅ Get All Payrolls
export const getAllPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        employee: true,
        Attendance: true,
      },
    });

    return res.status(200).json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    return res.status(500).json({ message: "Failed to fetch payrolls", error: error.message || error });
  }
};

// ✅ Get Payroll by ID
export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid Payroll ID" });
    }

    const payroll = await prisma.payroll.findUnique({
      where: { id: Number(id) },
      include: { employee: true, Attendance: true },
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    return res.status(200).json(payroll);
  } catch (error) {
    console.error("Error fetching payroll:", error);
    return res.status(500).json({ message: "Failed to fetch payroll", error: error.message || error });
  }
};

// ✅ Update Payroll
export const updatePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { baseSalary, allowances, deductions, advancePayment, paymentStatus, paymentDate, attendanceId } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid Payroll ID" });
    }

    // Fetch old payroll to recalc salary
    const oldPayroll = await prisma.payroll.findUnique({ where: { id: Number(id) } });
    if (!oldPayroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Recalculate net salary
    const netSalary =
      (baseSalary ?? oldPayroll.baseSalary) +
      (allowances ?? oldPayroll.allowances) -
      (deductions ?? oldPayroll.deductions) -
      (advancePayment ?? oldPayroll.advancePayment);

    const payroll = await prisma.payroll.update({
      where: { id: Number(id) },
      data: {
        baseSalary,
        allowances,
        deductions,
        advancePayment,
        netSalary,
        paymentStatus,
        paymentDate: paymentStatus === "PAID" ? paymentDate || new Date() : null,
        attendanceId: attendanceId || null,
      },
    });

    return res.status(200).json({ message: "Payroll updated successfully", payroll });
  } catch (error) {
    console.error("Error updating payroll:", error);
    return res.status(500).json({ message: "Failed to update payroll", error: error.message || error });
  }
};

// ✅ Delete Payroll
export const deletePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid Payroll ID" });
    }

    await prisma.payroll.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    console.error("Error deleting payroll:", error);
    return res.status(500).json({ message: "Failed to delete payroll", error: error.message || error });
  }
};
