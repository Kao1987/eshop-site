// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verify = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('Authorization Header:', authHeader); // 調試用日誌
        if (!authHeader) {
            return res.status(401).json({ message: '未授權，缺少 Authorization 標頭' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Received Token:', token); 

        if (!token) {
            return res.status(401).json({ message: '未授權，缺少 token' });
        }
        // 使用 promisified 的 verify 函式進行 JWT 驗證
        const decoded = await verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); 

        if (!decoded) {
            return res.status(403).json({ message: '令牌無效' });
        }
        // 檢查解碼後的用戶角色
        if (decoded.role.toLowerCase() !=='admin') {
            return res.status(403).json({ message: '用戶角色未定義',errorCode: 'USER_ROLE_NOT_DEFINED' });
        } else if (decoded.role !== 'admin') {
            return res.status(401).json({ 
                message: '未授權，請重新登入',
                errorCode: 'NOT_AUTHORIZED'
            });
        }
        req.user = decoded; // 將解碼後的用戶資訊附加到 req 對象
        next(); // 確保請求繼續進行
    } catch (error) {
        console.error('認證中間件錯誤:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '登入已過期，請重新登入' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: '無效的認證token' });
        } else {
            return res.status(500).json({ message: '伺服器內部錯誤' });
        }
    }
};

module.exports = authMiddleware;
