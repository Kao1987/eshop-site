// backend/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


// 公共路由器
const publicRouter = express.Router();
// 用戶登入
publicRouter.post('/login', usersController.login.bind(usersController));
// 新增註冊路由
publicRouter.post('/register', usersController.register.bind(usersController));

// 受保護路由器
const protectedRouter = express.Router();
// 獲取所有用戶
protectedRouter.get('/', usersController.getAllUsers.bind(usersController));
// 根據 ID 獲取單個用戶
protectedRouter.get('/:id', usersController.getUserById.bind(usersController));
// 更新用戶
protectedRouter.put('/:id', usersController.updateUser.bind(usersController));
// 刪除用戶
protectedRouter.delete('/:id', usersController.deleteUser.bind(usersController));



module.exports = { publicRouter, protectedRouter };