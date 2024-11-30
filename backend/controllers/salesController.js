// backend/controllers/salesController.js
const pool = require('../config/db');

// 獲取銷售排行
exports.getSalesRanking = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const formattedDate = daysAgo.toISOString().slice(0,19).replace('T',' ');
    const [rows] = await pool.query(
      `SELECT oi.product_id, SUM(oi.quantity) AS quantity_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_date >= ?
      GROUP BY oi.product_id 
      ORDER BY quantity_sold DESC`,
      [formattedDate]
    );
    console.log('Sales Ranking Data:',rows);
    res.json(rows);
  } catch (error) {
    console.error('獲取銷售排行時出錯:',error);
    res.status(500).json({ message: '服務器錯誤' });
  }
};

