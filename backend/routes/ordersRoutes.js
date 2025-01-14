// backend/routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const db = require('../config/db');
const auth = require('../middleware/auth');

// 添加 auth 中間件到需要認證的路由
router.use(auth);

// 獲取所有訂單
router.get('/', ordersController.getAllOrders);

// 根據 ID 獲取單個訂單
router.get('/:id', ordersController.getOrderById);

// 新增訂單
router.post('/', ordersController.createOrder);

// 更新訂單
router.put('/:id', ordersController.updateOrder);

// 刪除訂單
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
