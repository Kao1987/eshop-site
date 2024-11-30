// backend/routes/specialOffersRoutes.js
const express = require('express');
const router = express.Router();
const specialOffersController = require('../controllers/specialOffersController');

// 獲取所有特價商品
router.get('/', specialOffersController.getAllSpecialOffers);

// 根據 ID 獲取單個特價商品
router.get('/:id', specialOffersController.getSpecialOfferById);

// 新增特價商品
router.post('/', specialOffersController.createSpecialOffer);

// 更新特價商品
router.put('/:id', specialOffersController.updateSpecialOffer);

// 刪除特價商品
router.delete('/:id', specialOffersController.deleteSpecialOffer);

module.exports = router;
