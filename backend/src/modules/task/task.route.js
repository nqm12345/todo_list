import express from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "./task.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(verifyToken);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
