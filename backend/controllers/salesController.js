// backend/controllers/salesController.js
const { pool } = require('../config/db');

// 獲取銷售排行
exports.getSalesRanking = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const formattedDate = daysAgo.toISOString().slice(0,19).replace('T',' ');
    const [rows] = await pool.query(
        `SELECT 
            oi.product_id, 
            p.name,
            SUM(oi.quantity) AS sale_count
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.order_date >= ?
        AND o.status != 'cancelled'
        GROUP BY oi.product_id, p.name
        ORDER BY sale_count DESC
        LIMIT 10`,
        [formattedDate]
    );
    console.log('Sales Ranking Data:',rows);
    res.json(rows);
  } catch (error) {
    console.error('獲取銷售排行時出錯:',error);
    res.status(500).json({ message: '服務器錯誤' });
  }
};

