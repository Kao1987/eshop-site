// backend/routes/recipientsRoutes.js
const express = require('express');
const router = express.Router();
const recipientsController = require('../controllers/recipientsController');


// 獲取所有收件人
router.get('/', recipientsController.getAllrecipients); 

// 根據 ID 獲取單個收件人
router.get('/:id', recipientsController.getrecipientById);

// 新增收件人
router.post('/', recipientsController.createrecipient);

// 更新收件人
router.put('/:id', recipientsController.updaterecipient);

// 刪除收件人
router.delete('/:id', recipientsController.deleterecipient);

module.exports = router;
