// backend/controllers/salesController.js
const { pool } = require('../config/db')

// 獲取銷售排行
exports.getSalesRanking = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const query =
        `SELECT 
        p.id AS product_id,
        p.name,
        p.image,
        p.price,
        SUM(oi.quantity) AS sales_count
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.order_date >= DATE_SUB(NOW(),INTERVAL ? DAY)
        AND o.status != 'cancelled'
        GROUP BY p.id, p.name,p.image,p.price
        ORDER BY sales_count DESC
        LIMIT 10`;
    const [rows] = await pool.query(query,[days]);
    res.json({
      success:true,
      data:rows.map(row=>({
        id:row.product_id,
        name:row.name,
        image:row.image,
        price:row.price,
        sales_count:row.sales_count
      }))
    });
  } catch (error) {
    console.error('獲取銷售排行時出錯:',error);
    res.status(500).json({success:false, message: '服務器錯誤' });
  }
};

