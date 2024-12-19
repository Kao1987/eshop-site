// backend/controllers/orderItemsController.js
const { pool } = require('../config/db');

// 獲取所有購物車
exports.getAllOrderItems = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM order_items');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個購物車
exports.getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM order_items WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '購物車未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增購物車
exports.createOrderItem = async (req, res) => {
  const data = req.body;
  try {
    const [result] = await pool.query('INSERT INTO order_items SET ?', data);
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新購物車
exports.updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE order_items SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '購物車未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除購物車
exports.deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM order_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '購物車未找到' });
    }
    res.json({ message: '購物車已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
