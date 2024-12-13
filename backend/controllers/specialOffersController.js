// backend/controllers/specialOffersController.js
const pool = require('../config/db');

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
    const { product_id, price, countdown, created_at } = req.body;
    if(!product_id || !price || !countdown || !created_at){
      return res.status(400).json({ message: '缺少必要欄位' });
    }
    const specialOfferData = {
      product_id: parseInt(product_id, 10),
      price: parseFloat(price),
      countdown: parseInt(countdown, 10),
      created_at: created_at || new Date().toISOString().slice(0, 10)
    };
    const [result] = await connection.query('INSERT INTO special_offers SET ?', specialOfferData);
    const specialOfferId = result.insertId;
    await connection.commit();
    
    const [specialOffer] = await connection.query('SELECT * FROM special_offers WHERE id = ?', [specialOfferId]);
    res.status(201).json( specialOffer[0] );
  } catch (error) {
    await connection.rollback();
    console.error('新增特價商品時出錯',error);
    res.status(500).json({ message: '伺服器錯誤',error: error.message });
  }finally{
    connection.release();
  }
};

// 更新特價商品
exports.updateSpecialOffer = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
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
