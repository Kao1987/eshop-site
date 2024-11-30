// backend/routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// 獲取所有訂單
router.get('/', ordersController.getAllOrders);

// 根據 ID 獲取單個訂單
router.get('/:id', ordersController.getOrderById);

// 新增訂單
router.post('/', ordersController.createOrder);

// 更新訂單
router.put('/:id', ordersController.updateOrder);
router.put('/:id/status', ordersController.updateOrderStatus);


// 刪除訂單
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
