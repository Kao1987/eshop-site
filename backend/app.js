// backend/app.js
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const cors = require('cors');
// const dotenv = require('dotenv');

// 載入所有路由
const brandsRoutes = require('./routes/brandsRoutes');
const carouselImagesRoutes = require('./routes/carouselImagesRoutes');
const orderItemsRoutes = require('./routes/orderItemsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const productsRoutes = require('./routes/productsRoutes');
const recipientsRoutes = require('./routes/recipientsRoutes');
const salesRoutes = require('./routes/salesRoutes');
const specialOffersRoutes = require('./routes/specialOffersRoutes');
const tagsRoutes = require('./routes/tagsRoutes');
const usersRoutes = require('./routes/usersRoutes');

// dotenv.config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const app = express();

// 中介軟體
app.use(cors({
    origin: 'http://localhost:8081',
    methods:'GET,HEAD,PUT,POST,DELETE',
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 設置靜態資源路徑
app.use('/img',express.static(path.join(__dirname, 'public','img')));
app.use(express.static(path.join(__dirname, 'public')));


// 路由
app.use('/api/brands', brandsRoutes);
app.use('/api/carousel_images', carouselImagesRoutes);
app.use('/api/order-items', orderItemsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/recipients', recipientsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/special-offers', specialOffersRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/users', usersRoutes);

// 根路由
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname,'public','index.html'));
});

// 啟動伺服器
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
