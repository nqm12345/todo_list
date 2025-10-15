import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* --- REGISTER --- */
export const register = async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;

    if (!username || !email || !password || !confirm) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ." });
    }

    if (password !== confirm) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
    }

    const strength = checkPasswordStrength(password);
    if (strength.level === "Yếu") {
      return res.status(400).json({
        message: "Mật khẩu quá yếu. Dùng ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    return res.status(201).json({
      message: "Đăng ký thành công.",
      passwordStrength: strength.level,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Lỗi register:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

/* --- LOGIN --- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email này chưa được đăng ký." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
