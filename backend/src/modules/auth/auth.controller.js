import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* --- REGISTER --- */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra thiếu thông tin
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra email đã tồn tại
    const isCheckEmail = await User.findOne({ email });
    if (isCheckEmail) {
      return res
        .status(400)
        .json({ message: `Email ${email} đã tồn tại, vui lòng nhập email khác.` });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Trả phản hồi
    return res.status(201).json({
      message: `Đăng ký thành công.`,
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

    // Kiểm tra thiếu thông tin
    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });

    // Kiểm tra email có tồn tại
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: `Email này chưa được đăng ký.` });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng." });

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Trả phản hồi thành công
    return res.json({
      message: `Đăng nhập thành công.`,
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
