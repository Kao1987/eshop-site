// backend/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 獲取所有用戶
router.get('/', usersController.getAllUsers.bind(usersController));

// 根據 ID 獲取單個用戶
router.get('/:id', usersController.getUserById.bind(usersController));

// 新增註冊路由
router.post('/register', usersController.register.bind(usersController));

// 更新用戶
router.put('/:id', usersController.updateUser.bind(usersController));

// 刪除用戶
router.delete('/:id', usersController.deleteUser.bind(usersController));

// 用戶登入
router.post('/login', usersController.login.bind(usersController));

module.exports = router;