// backend/routes/carouselimagesRoutes.js
const express = require('express');
const router = express.Router();
const carouselImagesController = require('../controllers/carouselImagesController');
const multer = require('multer');
const path = require('path');

// 設定儲存位置和檔名
const storage = multer.diskStorage({
    destination:function(req, file, cb){
    cb(null,path.join(__dirname, '..','public','img','carouselImages'));
    },
    filename:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null,uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

// 新增輪播圖
router.post('/',upload.single('image'), carouselImagesController.createCarouselImage);
console.log('carouselImagesController:', carouselImagesController); // 調試訊息

// 獲取所有輪播圖
router.get('/', carouselImagesController.getAllCarouselImages);

// 根據 ID 獲取單個輪播圖
router.get('/:id', carouselImagesController.getCarouselImageById);

// 更新輪播圖
router.put('/:id', carouselImagesController.updateCarouselImage);

// 刪除輪播圖
router.delete('/:id', carouselImagesController.deleteCarouselImage);

module.exports = router;
