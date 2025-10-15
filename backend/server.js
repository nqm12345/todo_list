import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/modules/auth/auth.router.js";
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

//
app.use("/api/auth", authRoutes);

// Route kiểm tra
app.get("/", (req, res) => {
  res.send("Server đang chạy...");
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy ở cổng ${PORT}`));
