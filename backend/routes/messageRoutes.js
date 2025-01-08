// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// 新增訊息
router.post('/', messageController.createMessage);

module.exports = router;