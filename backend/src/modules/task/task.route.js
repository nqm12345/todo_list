import express from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask, exportTasks, importTasks, importExcel, importCSV } from "./task.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(verifyToken);

// Import/Export routes (phải đặt trước /:id để tránh conflict)
router.get("/export", exportTasks);
router.post("/import", importTasks);
router.post("/import-excel", importExcel);
router.post("/import-csv", importCSV);

// CRUD routes
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
