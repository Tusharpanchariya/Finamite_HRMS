import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prismaClient";

// Extend Express Request type to include multer file

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { departmentName, state, userEmail, email, photo: base64Photo, ...employeeData } = req.body;

    if (employeeData.joiningDate) employeeData.joiningDate = new Date(employeeData.joiningDate);
    if (employeeData.dateOfBirth) employeeData.dateOfBirth = new Date(employeeData.dateOfBirth);

    const department = await prisma.department.findFirst({ where: { name: departmentName } });
    if (!department) return res.status(400).json({ success: false, message: "Invalid department name" });

    let userId: string | undefined;
    if (userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      userId = user?.id;
    }

    // Handle Base64 photo
    let photoPath: string | null = null;
    if (base64Photo) {
      // Remove the data URL header if present
      const base64Data = base64Photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `uploads/${Date.now()}-employee-photo.jpg`;
      const fs = require("fs");
      fs.writeFileSync(fileName, buffer);
      photoPath = fileName;
    }

    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        email,
        departmentId: department.id,
        state,
        userId,
        photo: photoPath,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { department, state, status, name } = req.query;

    // Build dynamic filters
    const where: Prisma.EmployeeWhereInput = {
      ...(name ? { fullName: { contains: name as string, mode: "insensitive" } } : {}),
      ...(department
        ? { department: { name: { equals: department as string, mode: "insensitive" } } }
        : {}),
      ...(state ? { state: { equals: state as string, mode: "insensitive" } } : {}),
      ...(status ? { status: status as any } : {}) // Adjust based on EnumEmployeeStatus
    };

    // Fetch filtered employees and total employee count
    const [employees, filteredCount, totalEmployees] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          department: { select: { name: true } },
          user: { select: { email: true } }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.employee.count({ where }), // filtered count
      prisma.employee.count() // total employees (unfiltered)
    ]);

    // Format avatar URLs
    const formattedEmployees = employees.map(emp => ({
      ...emp,
      avatar: emp.avatar
        ? `${req.protocol}://${req.get('host')}/${emp.avatar}`
        : null
    }));

    return res.status(200).json({
      success: true,
      totalEmployees, // Total employees in system
      filteredCount,  // Count based on applied filters
      data: formattedEmployees
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};


export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { department: true, user: true }
    });

    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error("Get Employee By ID Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch employee" });
  }
};

export const updateEmployee = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(Number(id))) return res.status(400).json({ success: false, message: "Invalid employee ID" });

    // Convert dates safely
    try {
      if (updateData.joiningDate) {
        updateData.joiningDate = new Date(updateData.joiningDate);
        if (isNaN(updateData.joiningDate.getTime())) throw new Error("Invalid joining date format");
      }
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
        if (isNaN(updateData.dateOfBirth.getTime())) throw new Error("Invalid date of birth format");
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: (err as Error).message });
    }

    // Handle department update if name provided
    if (updateData.departmentName) {
      const department = await prisma.department.findFirst({ where: { name: updateData.departmentName } });
      if (!department) return res.status(400).json({ success: false, message: "Invalid department name" });
      updateData.departmentId = department.id;
      delete updateData.departmentName;
    }

    // state is a string now, just update directly
    if (updateData.state) updateData.state = updateData.state;

    // Handle photo update if file uploaded
    if (req.file) updateData.photo = req.file.path;

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: updateData
    });

    return res.status(200).json({ success: true, message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({ where: { id: Number(id) } });

    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.status(500).json({ success: false, message: "Failed to delete employee" });
  }
};
