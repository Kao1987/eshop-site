// backend/routes/productsRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productsController = require('../controllers/productsController');

// 配置 multer 處理文件上傳
const storage = multer.diskStorage({
    destination:function (req, file, cb){
        const uploadDir = path.join(__dirname, '..', 'public', 'img', 'products');
        cb(null,uploadDir)
    },
    filename:function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// 上傳文件過濾器 
const fileFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('不支援的文件類型'),false);
    }
};
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
});
// 搜索產品
router.get('/search',productsController.searchProducts);

// 獲取所有產品
router.get('/', productsController.getAllProducts);

// 根據 ID 獲取單個產品
router.get('/:id', productsController.getProductById);

// 新增產品
router.post('/',upload.single('image'), productsController.createProduct);

// 更新產品
router.put('/:id',upload.single('image'), productsController.updateProduct);

// 刪除產品
router.delete('/:id', productsController.deleteProduct);


module.exports = router;
