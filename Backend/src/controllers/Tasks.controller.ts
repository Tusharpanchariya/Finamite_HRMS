import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, name, description, assignedTo, startDate, endDate, status } = req.body;

    const task = await prisma.task.create({
      data: {
        projectId,
        name,
        description,
        assignedTo,
        startDate: new Date(startDate), // Convert to Date
        endDate: endDate ? new Date(endDate) : null,
        status,
      },
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", details: error });
  }
};
// ✅ Get All Tasks (with project info)
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true, timeEntries: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error });
  }
};

// ✅ Get Task By ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { project: true, timeEntries: true },
    });

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task", details: error });
  }
};

// ✅ Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", details: error });
  }
};

// ✅ Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id: Number(id) } });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task", details: error });
  }
};