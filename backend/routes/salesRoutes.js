// backend/routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// 获取销售排行
router.get('/ranking', salesController.getSalesRanking);

module.exports = router;
