import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//  Create or Update Statutory Details

export const createStatutoryDetails = async (req: Request, res: Response) => {
  const {
    employeeId,
    employeeCode,
    panNumber,
    aadhaarNumber,
    bankAccount,
    ifscCode,
    uanNumber,
    esicNumber,
    bankName,   
  } = req.body;

  // Validate employeeId
  if (employeeId === undefined || employeeId === null) {
    return res.status(400).json({ error: "employeeId is required" });
  }

  const empId = Number(employeeId);
  if (isNaN(empId)) {
    return res.status(400).json({ error: "employeeId must be a valid number" });
  }

  try {
    // Check if employee exists
    const employeeExists = await prisma.employee.findUnique({
      where: { id: empId },
    });

    if (!employeeExists) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if statutory details already exist
    const existingDetails = await prisma.employeeStatutoryDetails.findUnique({
      where: { employeeId: empId },
    });

    if (existingDetails) {
      // Update existing record
      const updated = await prisma.employeeStatutoryDetails.update({
        where: { employeeId: empId },
        data: {
          employeeCode,
          panNumber,
          aadhaarNumber,
          bankAccount,
          ifscCode,
          uanNumber,
          esicNumber,
          bankName,  // ✅ Now also update bankName
        },
      });
      return res
        .status(200)
        .json({ message: "Details updated successfully", data: updated });
    }

    // Create new record
    const created = await prisma.employeeStatutoryDetails.create({
      data: {
        employeeId: empId,
        employeeCode,
        panNumber,
        aadhaarNumber,
        bankAccount,
        ifscCode,
        uanNumber,
        esicNumber,
        bankName,  // ✅ Now also save bankName
      },
    });

    return res
      .status(201)
      .json({ message: "Details created successfully", data: created });
  } catch (error) {
    console.error("createOrUpdateStatutoryDetails error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//  Get by Employee ID

export const getStatutoryDetailsByEmployeeId = async (req: Request, res: Response) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    return res.status(400).json({ error: 'employeeId is required' });
  }

  const empId = Number(employeeId);
  if (isNaN(empId)) {
    return res.status(400).json({ error: 'employeeId must be a valid number' });
  }

  try {
    const details = await prisma.employeeStatutoryDetails.findUnique({
      where: { employeeId: empId },
    });

    if (!details) {
      return res.status(404).json({ error: 'Details not found' });
    }

    return res.status(200).json({ data: details });
  } catch (error) {
    console.error('getStatutoryDetailsByEmployeeId error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
//  get all deatils 

export const getAllStatutoryDetails = async (_req: Request, res: Response) => {
  try {
    const details = await prisma.employeeStatutoryDetails.findMany({
      orderBy: { employeeId: 'asc' }, // optional: keeps data sorted
    });

    if (!details.length) {
      return res.status(404).json({ error: 'No statutory details found' });
    }

    return res.status(200).json({ data: details });
  } catch (error) {
    console.error('getAllStatutoryDetails error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update deatils 
export const updateStatutoryDetails = async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const {
    employeeCode,
    panNumber,
    aadhaarNumber,
    bankAccount,
    ifscCode,
    uanNumber,
    esicNumber,
  } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: 'employeeId is required' });
  }

  const empId = Number(employeeId);
  if (isNaN(empId)) {
    return res.status(400).json({ error: 'employeeId must be a number' });
  }

  try {
    // Check if statutory details exist for this employee
    const existing = await prisma.employeeStatutoryDetails.findUnique({
      where: { employeeId: empId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Statutory details not found for this employee' });
    }

    const updated = await prisma.employeeStatutoryDetails.update({
      where: { employeeId: empId },
      data: {
        employeeCode,
        panNumber,
        aadhaarNumber,
        bankAccount,
        ifscCode,
        uanNumber,
        esicNumber,
      },
    });

    return res.status(200).json({ message: 'Details updated successfully', data: updated });
  } catch (error) {
    console.error('updateStatutoryDetails error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// ✅ Delete by Employee ID
export const deleteStatutoryDetails = async (req: Request, res: Response) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    return res.status(400).json({ error: 'employeeId is required' });
  }

  const empId = Number(employeeId);
  if (isNaN(empId)) {
    return res.status(400).json({ error: 'employeeId must be a number' });
  }

  try {
    const existing = await prisma.employeeStatutoryDetails.findUnique({
      where: { employeeId: empId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Details not found' });
    }

    await prisma.employeeStatutoryDetails.delete({
      where: { employeeId: empId },
    });

    return res.status(200).json({ message: 'Details deleted successfully' });
  } catch (error) {
    console.error('deleteStatutoryDetails error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
