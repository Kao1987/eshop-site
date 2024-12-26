// backend/controllers/tagsController.js
const { pool } = require('../config/db');

// 獲取所有標籤
exports.getAlltags = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tags');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個標籤
exports.gettagById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM tags WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '標籤未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增標籤
exports.createtag = async (req, res) => {
  try {
    // 檢查請求內容
    let tagName;
    if (typeof req.body === 'string') {
        tagName = req.body;
    } else if (req.body.name) {
        tagName = req.body.name;
    } else {
        return res.status(400).json({ message: '標籤名稱不能為空' });
    }

    // 檢查標籤是否已存在
    const [existing] = await pool.query('SELECT * FROM tags WHERE name = ?', [tagName]);
    if (existing.length > 0) {
        return res.status(409).json({ message: '此標籤已存在' });
    }

    // 新增標籤
    const [result] = await pool.query('INSERT INTO tags (name) VALUES (?)', [tagName]);
    
    res.status(201).json({
        id: result.insertId,
        name: tagName
    });
} catch (error) {
    console.error('新增標籤時出錯:', error);
    res.status(500).json({ message: '伺服器錯誤' });
}
};

// 更新標籤
exports.updatetag = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE tags SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '標籤未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除標籤
exports.deletetag = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM tags WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '標籤未找到' });
    }
    res.json({ message: '標籤已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
