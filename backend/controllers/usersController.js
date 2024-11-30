// backend/controllers/usersController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// 登入使用者
exports.login = async (req, res)=>{
  const { email , password } = req.body;

  try{
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?',[email]);
    if(users.length === 0){
      return res.status(404).json({ message: '帳號或密碼錯誤！' });
    }
    const user = users[0];
    try{
          const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
      return res.status(401).json({ message: '帳號或密碼錯誤！' });
    }
    }catch(error){
      console.error('密碼比對錯誤！',error);
      res.status(500).json({ message: '伺服器錯誤！' });
    }
  delete user.password;
  res.json(user);
  }catch(error){
    console.error('登入失敗',error);
    res.status(500).json({ message: '伺服器錯誤！' });
  }
}  
// 獲取所有使用者
exports.getAllusers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個使用者
exports.getuserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '使用者未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增使用者
exports.createuser = async (req, res) => {
  const { name, email, password, role, phone, address} = req.body;
  
  if(!name||!email||!password||!role){
    return res.status(400).json({message:'請填寫所有必要欄位'});
  }
    try {
      const [existingUser]= await pool.query('SELECT * FROM users WHERE email = ?',[email]);
      if(existingUser.length>0){
        return res.status(400).json({message:'此信箱已被註冊'});
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // 準備要插入的資料
      const userData = {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address
      };
      // 插入資料庫
      const [result] = await pool.query('INSERT INTO users SET ?', userData);
      res.status(201).json({ id: result.insertId,...userData });
    } catch (error) {
      console.error('建立新用戶發生錯誤。',error);
      res.status(500).json({ message: '伺服器錯誤' });
    }
};

// 更新使用者
exports.updateuser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '使用者未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除使用者
exports.deleteuser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '使用者未找到' });
    }
    res.json({ message: '使用者已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
