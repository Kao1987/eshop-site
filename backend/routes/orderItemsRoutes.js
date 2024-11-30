// backend/routes/orderitemsRoutes.js
const express = require('express');
const router = express.Router();
const orderItemsController = require('../controllers/orderItemsController');

// 獲取所有購物車
router.get('/', orderItemsController.getAllOrderItems);

// 根據 ID 獲取單個購物車
router.get('/:id', orderItemsController.getOrderItemById);

// 新增購物車
router.post('/', orderItemsController.createOrderItem);

// 更新購物車
router.put('/:id', orderItemsController.updateOrderItem);

// 刪除購物車
router.delete('/:id', orderItemsController.deleteOrderItem);

module.exports = router;
