// backend/controllers/recipientsController.js
const { pool } = require('../config/db');

// 獲取所有收件人
exports.getAllrecipients = async (req, res) => {
  try {
    const {user_id} = req.query;
    let query = 'SELECT * FROM recipients';
    const params = [];

      if(user_id){
        query += ' WHERE user_id =?';
        params.push(user_id);
      }    
      const[rows] = await pool.query(query,params);
      res.json({ success: true, data: rows });
    }catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個收件人
exports.getrecipientById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM recipients WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '收件人未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增收件人
exports.createrecipient = async (req, res) => {
  const data = req.body;
  try {
    const [result] = await pool.query('INSERT INTO recipients SET ?', data);
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新收件人
exports.updaterecipient = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE recipients SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '收件人未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除收件人
exports.deleterecipient = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM recipients WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '收件人未找到' });
    }
    res.json({ message: '收件人已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
