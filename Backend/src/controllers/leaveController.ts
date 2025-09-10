import { Request, Response } from "express";
import { PrismaClient, ApprovalStatus, Prisma, EmployeeType, LeaveType } from "@prisma/client";
import { sendLeaveStatusEmail } from "../utils/mailer";

const prisma = new PrismaClient();

/**
 * ✅ Create new Leave Request
 */
export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, leaveType, leaveReason } = req.body;

    if (!employeeId || !startDate || !endDate || !leaveType || !leaveReason) {
      return res.status(400).json({
        success: false,
        message: "All fields (employeeId, startDate, endDate, leaveType, leaveReason) are required",
      });
    }

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        startDate: start,
        endDate: end,
        leaveType,
        leaveReason,
        approvalStatus: "PENDING",
        totalDays,
      },
    });

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      leave,
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create leave request",
    });
  }
};
/**
 * ✅ Get all leaves of an Employee
 */
export const getEmployeeLeaves = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    const leaves = await prisma.leave.findMany({
      where: { employeeId: Number(employeeId) },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leaves" });
  }
};

// getAll 


export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      approvalStatus,
      leaveType,
      departmentId,
      employeeId,
      startDate,
      endDate,
      employeeType,
      search,
    } = req.query;

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Prisma.LeaveWhereInput = {};

    // Approval Status filter (string-based, no enum validation)
    if (approvalStatus) {
      if (Array.isArray(approvalStatus)) {
        where.approvalStatus = { in: approvalStatus as string[] };
      } else {
        where.approvalStatus = approvalStatus as string;
      }
    }

    // Leave Type filter (string-based, no enum validation)
    if (leaveType) {
      if (Array.isArray(leaveType)) {
        where.leaveType = { in: leaveType as string[] };
      } else {
        where.leaveType = leaveType as string;
      }
    }

    // Department filter
    if (departmentId) {
      const departmentIds = Array.isArray(departmentId) 
        ? (departmentId as string[]).map(id => parseInt(id))
        : [parseInt(departmentId as string)];
      
      where.employee = {
        ...where.employee,
        departmentId: { in: departmentIds.filter(id => !isNaN(id)) }
      };
    }

    // Employee filter
    if (employeeId) {
      const employeeIds = Array.isArray(employeeId)
        ? (employeeId as string[]).map(id => parseInt(id))
        : [parseInt(employeeId as string)];
      
      where.employeeId = { in: employeeIds.filter(id => !isNaN(id)) };
    }

    // Employee Type filter (string-based, no enum validation)
    if (employeeType) {
      if (Array.isArray(employeeType)) {
        where.employee = {
          ...where.employee,
          employeeType: { in: employeeType as string[] }
        };
      } else {
        where.employee = {
          ...where.employee,
          employeeType: employeeType as string
        };
      }
    }

    // Date range filter
    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            ...(startDate && { gte: new Date(startDate as string) }),
            ...(endDate && { lte: new Date(endDate as string) })
          }
        },
        {
          endDate: {
            ...(startDate && { gte: new Date(startDate as string) }),
            ...(endDate && { lte: new Date(endDate as string) })
          }
        }
      ];
    }

    // Search filter (by employee name)
    if (search) {
      where.employee = {
        ...where.employee,
        fullName: {
          contains: search as string,
          mode: 'insensitive'
        }
      };
    }

    // Execute queries
    const [leaves, totalLeaves] = await Promise.all([
      prisma.leave.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              contactNumber: true,
              designation: true,
              employeeType: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.leave.count({ where }),
    ]);

    // Transform response
    const transformedLeaves = leaves.map(leave => ({
      id: leave.id,
      employeeId: leave.employeeId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      leaveType: leave.leaveType,
      leaveReason: leave.leaveReason,
      approvalStatus: leave.approvalStatus,
      totalDays: leave.totalDays,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
      employee: {
        id: leave.employee.id,
        fullName: leave.employee.fullName,
        email: leave.employee.user?.email || null,
        contactNumber: leave.employee.contactNumber,
        designation: leave.employee.designation,
        employeeType: leave.employee.employeeType,
        department: leave.employee.department,
      },
    }));

    const totalPages = Math.ceil(totalLeaves / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Leaves fetched successfully',
      data: transformedLeaves,
      meta: {
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalLeaves,
          itemsPerPage: limitNum,
          hasNext: pageNum < totalPages,
          hasPrevious: pageNum > 1,
        },
        filters: {
          ...(approvalStatus && { approvalStatus }),
          ...(leaveType && { leaveType }),
          ...(departmentId && { departmentId }),
          ...(employeeType && { employeeType }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(search && { search }),
        },
      },
    });

  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    
    // Handle specific Prisma validation errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' || error.code === 'P2025') {
        return res.status(400).json({
          success: false,
          message: 'Invalid filter value provided',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * ✅ Approve / Reject Leave
 */
export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { leaveId } = req.params;
    const { approvalStatus } = req.body;

    if (!approvalStatus) {
      return res.status(400).json({
        success: false,
        message: "approvalStatus is required",
      });
    }

    // Check if leave exists
    const existingLeave = await prisma.leave.findUnique({
      where: { id: parseInt(leaveId) },
    });

    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // Update leave status (removed approvedAt since not in schema)
    const updatedLeave = await prisma.leave.update({
      where: { id: parseInt(leaveId) },
      data: {
        approvalStatus: approvalStatus.toUpperCase(),
        // if you want to store who approved:
        // approvedById: req.user.id   // (if you are storing logged-in approver)
      },
    });

    return res.status(200).json({
      success: true,
      message: `Leave status updated to ${updatedLeave.approvalStatus}`,
      data: updatedLeave,
    });
  } catch (error: any) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


/**
 * ✅ Cancel Leave Request
 */




export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const { leaveId } = req.params;

    // ✅ Check if leave exists
    const existingLeave = await prisma.leave.findUnique({
      where: { id: parseInt(leaveId) },
    });

    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // ✅ Delete the leave
    await prisma.leave.delete({
      where: { id: parseInt(leaveId) },
    });

    return res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting leave:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// export const deleteLeave = async (req: Request, res: Response) => {
//   try {
//     const { leaveId } = req.params;

//     // ✅ Check if leave exists
//     const existingLeave = await prisma.leave.findUnique({
//       where: { id: parseInt(leaveId) },
//     });

//     if (!existingLeave) {
//       return res.status(404).json({
//         success: false,
//         message: "Leave not found",
//       });
//     }

//     // ✅ Delete the leave
//     await prisma.leave.delete({
//       where: { id: parseInt(leaveId) },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Leave deleted successfully",
//     });
//   } catch (error: any) {
//     console.error("Error deleting leave:", error);

//     if (error.code === "P2025") {
//       return res.status(404).json({
//         success: false,
//         message: "Leave not found",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
