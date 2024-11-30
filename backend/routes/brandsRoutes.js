// backend/routes/brandsRoutes.js
const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brandsController');

// 獲取所有廠牌
router.get('/', brandsController.getAllbrands);

// 根據 ID 獲取單個廠牌
router.get('/:id', brandsController.getbrandById);

// 新增廠牌
router.post('/', brandsController.createbrand);

// 更新廠牌
router.put('/:id', brandsController.updatebrand);

// 刪除廠牌
router.delete('/:id', brandsController.deletebrand);

module.exports = router;
