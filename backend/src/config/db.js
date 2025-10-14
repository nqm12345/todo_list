import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    await mongoose.connect(mongoURI);
    console.log("Kết nối MongoDB thành công");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1); // Dừng server nếu không kết nối được
  }
};
