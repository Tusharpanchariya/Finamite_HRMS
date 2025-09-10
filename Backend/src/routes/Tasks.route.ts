import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from "../controllers/Tasks.controller";

const router = Router();

// ✅ Create task
router.post("/", createTask);

// ✅ Get all tasks
router.get("/", getTasks);

// ✅ Get single task
router.get("/:id", getTaskById);

// ✅ Update task
router.put("/:id", updateTask);

// ✅ Delete task
router.delete("/:id", deleteTask);

export default router;
