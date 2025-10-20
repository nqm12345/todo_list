import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ✅ Tự động chuyển về chữ thường
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // ✅ Tự động thêm createdAt và updatedAt
);

// ✅ Tạo index để enforce unique constraint
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.model("User", userSchema);