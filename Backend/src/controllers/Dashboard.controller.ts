import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Employees
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        fullName: true,
        department: { select: { id: true, name: true } },
        status: true,
        activeStatus: true,
      },
    });

    // 2️⃣ Attendance summary (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceSummary = await prisma.attendance.groupBy({
      by: ["status"],
      where: { attendanceDate: today },
      _count: { status: true },
    });

    // 3️⃣ Leave summary (pending)
    const pendingLeaves = await prisma.leave.count({
      where: { approvalStatus: "PENDING" },
    });

    // 4️⃣ Payroll summary
    const payrollSummary = await prisma.payroll.groupBy({
      by: ["paymentStatus"],
      _count: { id: true },
    });

    // 5️⃣ Trainings (active / upcoming)
    const activeTrainings = await prisma.training.count({
      where: { endDate: { gte: new Date() } },
    });

    // 6️⃣ Projects
    const projects = await prisma.project.findMany({
      select: { id: true, name: true },
    });

    // 7️⃣ Time entries (today)
    const timeEntriesToday = await prisma.timeEntry.count({
      where: {
        date: today,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        employees,
        attendanceSummary,
        pendingLeaves,
        payrollSummary,
        activeTrainings,
        projects,
        timeEntriesToday,
      },
    });
  } catch (error: any) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
