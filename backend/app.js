// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const {pool, testConnection} = require('./config/db');
// 初始化 Express 應用
const app = express();

// 環境變數配置
const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 中介軟體配置
app.use(cors({
    origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:8081']
    : ['https://kao1987.github.io', 'https://kao1987.github.io/ECshop'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,        
}));
console.log(process.env.NODE_ENV);

// 設定 crossOriginResourcePolicy 為 'cross-origin'，允許從其他網域載入圖片
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態資源配置
app.use('/api/img', express.static(path.join(__dirname, 'public', 'img')));


// 路由配置
const routes = {
    brands: require('./routes/brandsRoutes'),
    carouselImages: require('./routes/carouselImagesRoutes'),
    orderItems: require('./routes/orderItemsRoutes'),
    orders: require('./routes/ordersRoutes'),
    products: require('./routes/productsRoutes'),
    recipients: require('./routes/recipientsRoutes'),
    sales: require('./routes/salesRoutes'),
    specialOffers: require('./routes/specialOffersRoutes'),
    tags: require('./routes/tagsRoutes'),
    users: require('./routes/usersRoutes'),
    ranking: require('./routes/rankingRoutes')
};

app.use('/api/brands', routes.brands);
app.use('/api/carousel_images', routes.carouselImages);
app.use('/api/order_items', routes.orderItems);
app.use('/api/orders', routes.orders);
app.use('/api/products', routes.products);
app.use('/api/recipients', routes.recipients);
app.use('/api/sales', routes.sales);
app.use('/api/special_offers', routes.specialOffers);
app.use('/api/tags', routes.tags);
app.use('/api/users', routes.users);
app.use('/api/ranking', routes.ranking);

// 註冊路由（修改路由命名規則）
Object.entries(routes).forEach(([name, router]) => {
    const routePath = name.replace(/([A-Z])/g, '_$1').toLowerCase();
    app.use(`/api/${routePath}`, router);
});

// 檢查必要目錄
const ensureDirectories = () => {
    const dirs = [
        path.join(__dirname, 'public'),
        path.join(__dirname, 'public', 'img'),
        path.join(__dirname, 'dist')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// API 404 處理
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API 路徑未找到' });
});

// 全局錯誤處理
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || '內部伺服器錯誤';
    console.error('發生未捕獲的錯誤:', err);

    // 開發環境才輸出詳細錯誤
    if (process.env.NODE_ENV === 'development') {
        console.error('錯誤:', err);
        res.status(status).json({
            success: false,
            message,
            error: err.stack
        });
    }else {
        res.status(status).json({
            success: false,
            message
        });
    }
});

// 伺服器啟動函數
const startServer = async () => {
    try {
        ensureDirectories();
        await testConnection();

        // 測試資料庫連線
        // const db = require('./config/db');
        // await db.query('SELECT 1');
        
        // 檢查端口是否被占用
        const server = app.listen(PORT)
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${PORT} 已被占用，嘗試使用 ${PORT + 1}`);
                    server.close();
                    app.listen(PORT + 1);
                } else {
                    console.error('服務器啟動錯誤:', err);
                    process.exit(1);
                }
            })
            .on('listening', () => {    
                const actualPort = server.address().port;
                console.log(`
=================================
  伺服器啟動成功
  環境: ${NODE_ENV}
  端口: ${actualPort}
=================================`);
            });
    } catch (error) {
        console.error('伺服器啟動失敗:', error.message);
        process.exit(1);
    }
};

// 啟動伺服器
startServer();

module.exports = app;