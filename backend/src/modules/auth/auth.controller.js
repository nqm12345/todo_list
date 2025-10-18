import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* --- REGISTER --- */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Kiểm tra đầu vào
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ." });
    }

    // ✅ Kiểm tra độ mạnh mật khẩu
    const strength = checkPasswordStrength(password);
    if (strength.level === "Yếu") {
      return res.status(400).json({
        message: "Mật khẩu quá yếu. Dùng ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      });
    }

    // ✅ Kiểm tra email đã tồn tại (case-insensitive)
    const normalizedEmail = email.toLowerCase().trim();
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // ✅ Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(400).json({ message: "Tên người dùng đã được sử dụng." });
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // ✅ Tạo user mới
    const user = await User.create({ 
      username: username.trim(), 
      email: normalizedEmail, 
      password: hashed 
    });

    return res.status(201).json({
      message: "Đăng ký thành công.",
      passwordStrength: strength.level,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Lỗi register:", err);
    
    // ✅ Xử lý lỗi duplicate key từ MongoDB
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'Email' : 'Tên người dùng'} đã được sử dụng.` 
      });
    }
    
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

/* --- LOGIN --- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ✅ Kiểm tra đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    // ✅ Chuẩn hóa email (lowercase + trim)
    const normalizedEmail = email.toLowerCase().trim();
    
    // ✅ Tìm user với email đã chuẩn hóa
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Email này chưa được đăng ký." });
    }

    // ✅ So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng." });
    }

    // ✅ Tạo JWT token - Token dài hạn (1 giờ)
    // Frontend sẽ tự động logout khi idle 10 giây
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } // ⏱️ Token backend hết hạn sau 1 giờ
    );

    res.json({
      message: "Đăng nhập thành công.",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

/* --- ✅ Hàm kiểm tra độ mạnh mật khẩu backend --- */
function checkPasswordStrength(password) {
  const hasUpper   = /[A-Z]/.test(password);
  const hasLower   = /[a-z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLong     = password.length >= 8;

  let score = 0;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (isLong) score++;

  if (score <= 2) return { level: "Yếu" };
  if (score === 3 || score === 4) return { level: "Trung bình" };
  return { level: "Mạnh" };
}
