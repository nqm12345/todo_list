import jwt from 'jsonwebtoken';
import { createError } from '../../utils/error.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : (req.cookies.access_token || null);

    if (!token) {
      return res.status(401).json({ 
        message: 'Vui lòng đăng nhập để thực hiện chức năng này'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Token không hợp lệ hoặc đã hết hạn'
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Lỗi xác thực: ' + error.message 
    });
  }
};