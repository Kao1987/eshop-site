const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
                COUNT(oi.product_id) as sales_count
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id
            WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY p.id
            ORDER BY sales_count DESC
            LIMIT 10
        `;
        
        const [results] = await db.query(query, [days]);
        res.json(results);
    } catch (error) {
        console.error('獲取排行榜錯誤:', error);
        res.status(500).json({ message: '獲取排行榜失敗' });
    }
});

module.exports = router; 