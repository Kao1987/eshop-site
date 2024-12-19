// backend/controllers/usersController.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// backend/controllers/usersController.js
class UsersController {
// 獲取所有用戶
async getAllUsers(req, res) {
    try {
        const [users] = await pool.query('SELECT id, name, email, role FROM users');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('獲取所有用戶錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法獲取用戶資料'
        });
    }
}
async register(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { name, email, phone, address, password, role = 'user' } = req.body;

        // 檢查必填欄位
        if (!name || !email || !phone || !address || !password) {
            return res.status(400).json({ success: false, message: '所有欄位都是必填的' });
        }

        // 檢查電子郵件是否重複
        const [existingUsers] = await connection.query(
            'SELECT id FROM users WHERE email = ?', 
            [email]
        );
        
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: '此電子郵件已被註冊' });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用戶（不需要指定 created_at，讓它使用預設值）
        const [result] = await connection.query(
            `INSERT INTO users (name, email, phone, address, password, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, address, hashedPassword, role]
        );

        await connection.commit();

        // 查詢剛插入的用戶資料
        const [newUser] = await connection.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({ 
            success: true, 
            message: '註冊成功', 
            userId: result.insertId,
            user: newUser[0]
        });

    } catch (error) {
        await connection.rollback();
        console.error('註冊錯誤:', error);
        res.status(500).json({ 
            success: false, 
            message: '註冊失敗，請稍後再試',
            error: error.message 
        });
    } finally {
        connection.release();
    }
}
// 獲取單個用戶
async getUserById(req, res) {
    const { id } = req.params;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用戶不存在'
            });
        }
        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('獲取用戶錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法獲取用戶資料'
        });
    }
}

// 更新用戶
async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, role, phone, address, password } = req.body;

    try {
        // 檢查用戶是否存在
        const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用戶不存在'
            });
        }

        // 更新資料
        let updateFields = [];
        let updateValues = [];

        if (name) {
            updateFields.push('name = ?');
            updateValues.push(name.trim());
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email.toLowerCase().trim());
        }
        if (role) {
            updateFields.push('role = ?');
            updateValues.push(role);
        }
        if (phone) {
            updateFields.push('phone = ?');
            updateValues.push(phone.trim());
        }
        if (address) {
            updateFields.push('address = ?');
            updateValues.push(address.trim());
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: '沒有要更新的資料'
            });
        }

        updateValues.push(id);

        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: '用戶更新成功'
        });

    } catch (error) {
        console.error('更新用戶錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法更新用戶資料'
        });
    }
}

// 刪除用戶
async deleteUser(req, res) {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '用戶不存在'
            });
        }
        res.json({
            success: true,
            message: '用戶刪除成功'
        });
    } catch (error) {
        console.error('刪除用戶錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法刪除用戶'
        });
    }
}

// 用戶登入
async login(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '請輸入電子郵件和密碼'
            });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '帳號或密碼錯誤'
            });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: '帳號或密碼錯誤'
            });
        }
        // 生成 JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // 移除密碼資訊
        delete user.password;

        res.json({
            success: true,
            message: '登入成功',
            data: {
                ...user,
                token: token
            }
        });
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).json({
            success: false,
            message: '登入失敗，請稍後再試'
        });
    }
}
}
module.exports = new UsersController();