import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isCheckEmail = await User.findOne({ email });
    if (isCheckEmail) {
      return res.status(400).json({
        message: `Email ${email} đã tồn tại vui lòng nhập email khác!`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: `Đăng ký email ${email} thành công`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: `Lỗi server ${err.message}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: `Email ${email} chưa được đăng ký` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: `Đăng nhập email ${email} thành công`, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
