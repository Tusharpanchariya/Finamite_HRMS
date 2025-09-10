import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import * as xlsx from "xlsx";

// Manual attendance creation
// Helper function: Combine attendanceDate with HH:mm time
function combineDateWithTime(date: Date, timeString?: string): Date | null {
  if (!timeString) return null;

  // Enforce HH:mm format validation
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeString);
  if (!timeMatch) return null;

  const [hours, minutes] = timeString.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

// =============================
// CREATE MANUAL ATTENDANCE
// =============================
export const createManualAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, attendanceDate, inTime, outTime, status } = req.body;

    // Validate required fields
    if (!employeeId || !attendanceDate) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and attendance date are required"
      });
    }

    // Verify employee exists
    const employeeExists = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true }
    });

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Parse attendance date and times
    const parsedAttendanceDate = new Date(attendanceDate);
    const parsedInTime = combineDateWithTime(parsedAttendanceDate, inTime);
    const parsedOutTime = combineDateWithTime(parsedAttendanceDate, outTime);

    // Calculate hours if both times exist
    let totalHours = 0;
    let overtimeHours = 0;
    if (parsedInTime && parsedOutTime) {
      const timeDiffMs = parsedOutTime.getTime() - parsedInTime.getTime();
      totalHours = parseFloat((timeDiffMs / (1000 * 60 * 60)).toFixed(2));
      const STANDARD_HOURS = 8;
      overtimeHours = Math.max(0, totalHours - STANDARD_HOURS);
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employee: { connect: { id: employeeId } },
        attendanceDate: parsedAttendanceDate,
        inTime: parsedInTime,
        outTime: parsedOutTime,
        status: status || "PRESENT",
        isBiometric: false,
        totalHours,
        overtimeHours
      },
      select: {
        id: true,
        employeeId: true,
        attendanceDate: true,
        inTime: true,
        outTime: true,
        status: true,
        totalHours: true,
        overtimeHours: true
      }
    });

    return res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error("Manual attendance error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Attendance already exists for this employee and date"
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create manual attendance record"
    });
  }
};

// Helper: Combine date (yyyy-mm-dd) with time (HH:mm or HH:mm:ss)
export const uploadAttendanceFromExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      const employeeId = Number(row.employeeId);

      // Parse attendance date
      let rawDate: Date | null = null;
      if (typeof row.attendanceDate === "number") {
        // Excel serial number
        const parsed = xlsx.SSF.parse_date_code(row.attendanceDate);
        rawDate = parsed
          ? new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d))
          : null;
      } else if (typeof row.attendanceDate === "string") {
        rawDate = new Date(row.attendanceDate);
      }

      if (!employeeId || isNaN(employeeId) || !rawDate || isNaN(rawDate.getTime())) {
        console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
        skippedCount++;
        continue;
      }

      // Parse in/out times (string or number)
      const datePart = rawDate.toISOString().split("T")[0];

      const inTime =
        row.inTime !== undefined && row.inTime !== null
          ? typeof row.inTime === "number"
            ? new Date(rawDate.getTime() + row.inTime * 24 * 60 * 60 * 1000) // Excel time fraction
            : new Date(`${datePart}T${row.inTime}`)
          : null;

      const outTime =
        row.outTime !== undefined && row.outTime !== null
          ? typeof row.outTime === "number"
            ? new Date(rawDate.getTime() + row.outTime * 24 * 60 * 60 * 1000)
            : new Date(`${datePart}T${row.outTime}`)
          : null;

      const status = row.status?.toString().trim().toUpperCase() || "PRESENT";
      const notes = row.notes || null;

      const totalHours =
        inTime && outTime
          ? (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60)
          : 0;

      await prisma.attendance.upsert({
        where: {
          employeeId_attendanceDate: {
            employeeId,
            attendanceDate: rawDate,
          },
        },
        update: {
          inTime,
          outTime,
          status,
          totalHours,
        },
        create: {
          employeeId,
          attendanceDate: rawDate,
          inTime,
          outTime,
          status,
          totalHours,
        },
      });

      insertedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Attendance upload completed. Inserted/Updated: ${insertedCount}, Skipped: ${skippedCount}`,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// =============================
// CREATE BULK ATTENDANCE
// =============================
export const createBulkAttendance = async (req: Request, res: Response) => {
  try {
    const attendances = req.body.attendances; // Expecting an array of attendance objects

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance array is required"
      });
    }

    // Validate each record
    for (const record of attendances) {
      if (!record.employeeId || !record.attendanceDate) {
        return res.status(400).json({
          success: false,
          message: "Each record must have employeeId and attendanceDate"
        });
      }
    }

    // Process all records
    const createdRecords = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const record of attendances) {
        const employeeExists = await tx.employee.findUnique({
          where: { id: record.employeeId },
          select: { id: true }
        });

        if (!employeeExists) {
          throw new Error(`Employee with ID ${record.employeeId} not found`);
        }

        const parsedAttendanceDate = new Date(record.attendanceDate);
        const parsedInTime = combineDateWithTime(parsedAttendanceDate, record.inTime);
        const parsedOutTime = combineDateWithTime(parsedAttendanceDate, record.outTime);

        let totalHours = 0;
        let overtimeHours = 0;
        if (parsedInTime && parsedOutTime) {
          const timeDiffMs = parsedOutTime.getTime() - parsedInTime.getTime();
          totalHours = parseFloat((timeDiffMs / (1000 * 60 * 60)).toFixed(2));
          const STANDARD_HOURS = 8;
          overtimeHours = Math.max(0, totalHours - STANDARD_HOURS);
        }

        const newAttendance = await tx.attendance.create({
          data: {
            employee: { connect: { id: record.employeeId } },
            attendanceDate: parsedAttendanceDate,
            inTime: parsedInTime,
            outTime: parsedOutTime,
            status: record.status || "PRESENT",
            isBiometric: false,
            totalHours,
            overtimeHours
          },
          select: {
            id: true,
            employeeId: true,
            attendanceDate: true,
            inTime: true,
            outTime: true,
            status: true,
            totalHours: true,
            overtimeHours: true
          }
        });

        results.push(newAttendance);
      }
      return results;
    });

    return res.status(201).json({
      success: true,
      message: `${createdRecords.length} attendance records created successfully`,
      data: createdRecords
    });

  } catch (error) {
    console.error("Bulk attendance creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create bulk attendance records"
    });
  }
};
// Get all attendances with pagination and filters
export const getAllAttendances = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AttendanceWhereInput = {};
    
    if (req.query.employeeId) whereClause.employeeId = req.query.employeeId as string;
    if (req.query.status) whereClause.status = req.query.status as string;
    if (req.query.startDate || req.query.endDate) {
      whereClause.attendanceDate = {};
      if (req.query.startDate) whereClause.attendanceDate.gte = new Date(req.query.startDate as string);
      if (req.query.endDate) whereClause.attendanceDate.lte = new Date(req.query.endDate as string);
    }

    const [attendances, totalCount] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { attendanceDate: 'desc' },
        include: {
          employee: {
            select: {
              fullName: true,
              department: true
            }
          }
        }
      }),
      prisma.attendance.count({ where: whereClause })
    ]);

    return res.status(200).json({
      success: true,
      data: attendances,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendances"
    });
  }
};

// Get single attendance by ID
export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Attendance ID is required"
      });
    }

    // Check your Prisma schema to determine if ID should be number or string
    // Solution 1: If your schema expects numeric IDs
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID format"
      });
    }

    // Solution 2: If your schema expects string IDs (like UUID)
    // const attendanceId = id; // Use this instead if your ID is string type

    const attendance = await prisma.attendance.findUnique({
      where: { 
        id: numericId // Change to attendanceId if using string IDs
      },
      include: {
        employee: {
          select: {
            id: true, // Always available
            fullName: true,
            // Use only fields that exist in your Employee model
            department: true,
            // Add other fields you need from your Employee model
            // Remove employeeId if it doesn't exist in your schema
          }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    // Transform response to match your needs
    const responseData = {
      id: attendance.id,
      attendanceDate: attendance.attendanceDate,
      inTime: attendance.inTime,
      outTime: attendance.outTime,
      status: attendance.status,
      employee: {
        id: attendance.employee.id,
        fullName: attendance.employee.fullName,
        department: attendance.employee.department
        // Include other fields you selected
      },
      totalHours: attendance.totalHours,
      overtimeHours: attendance.overtimeHours
    };

    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2023') {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance ID format"
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching attendance"
    });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { inTime, outTime, status } = req.body;

    // Validate ID - check if it's a valid number
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid numeric attendance ID is required"
      });
    }

    const attendanceId = Number(id);

    // Check if attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: attendanceId }
    });

    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    // Prepare update data with only valid fields
    const updateData: {
      inTime?: Date;
      outTime?: Date;
      status?: string;
      totalHours?: number;
      overtimeHours?: number;
    } = {};

    // Process time updates with validation
    if (inTime) {
      const parsedInTime = new Date(inTime);
      if (isNaN(parsedInTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid inTime format"
        });
      }
      updateData.inTime = parsedInTime;
    }

    if (outTime) {
      const parsedOutTime = new Date(outTime);
      if (isNaN(parsedOutTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid outTime format"
        });
      }
      updateData.outTime = parsedOutTime;
    }

    if (status) updateData.status = status;

    // Recalculate hours if either time changed
    if (inTime || outTime) {
      const effectiveInTime = updateData.inTime || existingAttendance.inTime;
      const effectiveOutTime = updateData.outTime || existingAttendance.outTime;

      if (effectiveInTime && effectiveOutTime) {
        const timeDiffMs = effectiveOutTime.getTime() - effectiveInTime.getTime();
        updateData.totalHours = parseFloat((timeDiffMs / (1000 * 60 * 60)).toFixed(2));
        const STANDARD_HOURS = 8;
        updateData.overtimeHours = Math.max(0, updateData.totalHours - STANDARD_HOURS);
      } else {
        // Clear hours if one of the times is missing
        updateData.totalHours = 0;
        updateData.overtimeHours = 0;
      }
    }

    // Update attendance with only valid fields
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: updateData,
      select: {
        id: true,
        employeeId: true,
        attendanceDate: true,
        inTime: true,
        outTime: true,
        status: true,
        totalHours: true,
        overtimeHours: true,
        isBiometric: true
        // Removed notes since it's not in your schema
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedAttendance
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found"
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update attendance record"
    });
  }
};

// Delete attendance
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Simple validation
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID"
      });
    }

    await prisma.attendance.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully"
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Attendance not found"
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete attendance"
    });
  }
};