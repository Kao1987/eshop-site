// backend/controllers/messageController.js
const { pool } = require('../config/db');


// 新增訊息
exports.createMessage = async (req, res) => {
  try {
    // 檢查請求內容
const {name,phone,email,message} = req.body;
if(!name || !phone || !email || !message){
    return res.status(400).json({ message: '請確認所有欄位都有填寫' });
}

    const [result] = await pool.query('INSERT INTO messages (name,phone,email,message) VALUES (?,?,?,?)',
         [name,phone,email,message]);
    
    res.status(201).json({
        id: result.insertId,
        name: name,
        phone: phone,
        email: email,
        message: message
    });
} catch (error) {
    console.error('新增訊息時出錯:', error);
    res.status(500).json({ message: '伺服器錯誤' });
}
};

