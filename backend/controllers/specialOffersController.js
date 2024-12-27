// backend/controllers/specialOffersController.js
const { pool } = require('../config/db');

// 獲取所有特價商品
exports.getAllSpecialOffers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM special_offers');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個特價商品
exports.getSpecialOfferById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM special_offers WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '特價商品未找到' });
    }
    if(rows[0].created_at){
      rows[0].created_at = new Date(rows[0].created_at).toISOString();
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增特價商品
exports.createSpecialOffer = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const data = req.body;
    // 驗證必要欄位
    if (!data.product_id || !data.price || !data.start_time || !data.duration) {
    return res.status(400).json({
        message: '缺少必要欄位',
        received: data
    });
  }
  data.created_at = new Date();
    // 檢查商品是否存在
    const [productExists] = await connection.query(
      'SELECT id FROM products WHERE id = ?', 
      [data.product_id]
    );
    if (productExists.length === 0) {
      return res.status(404).json({
        message: '商品不存在'
      });
    }
  // 格式化日期時間
  if(data.start_time){
    data.start_time = new Date(data.start_time).toISOString().slice(0, 19).replace('T', ' ');
  }
  // 插入特價商品
    const [result] = await pool.query('INSERT INTO special_offers SET ?', data);
    await connection.commit();
    res.status(201).json({id: result.insertId, ...data});
  } catch (error) {
    await connection.rollback();
    console.error('新增特價商品時出錯',error);
    res.status(500).json({ message: '伺服器錯誤',error: error.message });
  }
};

// 更新特價商品
exports.updateSpecialOffer = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if(data.start_time){
      data.start_time = new Date(data.start_time).toISOString().slice(0, 19).replace('T', ' ');
    }

    const [result] = await pool.query('UPDATE special_offers SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '特價商品未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除特價商品
exports.deleteSpecialOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM special_offers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '特價商品未找到' });
    }
    res.json({ message: '特價商品已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
