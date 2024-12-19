const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// 獲取指定天數內的商品排行
router.get('/', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7; // 預設7天
        const query = `
SELECT 
    p.id,
    p.name,
    p.price,
    p.image,
    SUM(oi.quantity) AS sales_count
    FROM products p
    INNER JOIN order_items oi ON p.id = oi.product_id
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
    AND o.status != 'cancelled'
    GROUP BY p.id, p.name, p.price, p.image
    HAVING sales_count > 0
    ORDER BY sales_count DESC
    LIMIT 10`
    ;
        
    const [results] = await pool.query(query, [days]);
    res.json(results);
    } catch (error) {
        console.error('獲取排行榜錯誤:', error);
        res.status(500).json({ message: '獲取排行榜失敗' });
    }
});

module.exports = router; 