// backend/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 獲取所有User
router.get('/', usersController.getAllusers);

// 根據 ID 獲取單個User
router.get('/:id', usersController.getuserById);

// 新增User
router.post('/', usersController.createuser);

// 更新User
router.put('/:id', usersController.updateuser);

// 刪除User
router.delete('/:id', usersController.deleteuser);

// 用戶登入
router.post('/login',usersController.login);

module.exports = router;
