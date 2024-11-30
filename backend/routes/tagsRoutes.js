// backend/routes/tagsRoutes.js
const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/TagsController');

// 獲取所有Tag
router.get('/', tagsController.getAlltags);

// 根據 ID 獲取單個Tag
router.get('/:id', tagsController.gettagById);

// 新增Tag
router.post('/', tagsController.createtag);

// 更新Tag
router.put('/:id', tagsController.updatetag);

// 刪除Tag
router.delete('/:id', tagsController.deletetag);

module.exports = router;
