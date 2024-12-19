// backend/config/db.js
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// 先檢查環境變數是否正確載入
console.log('Environment Variables Check:', {
    DB_HOST: process.env.DB_HOST || 'not set',
    DB_USER: process.env.DB_USER || 'not set',
    DB_NAME: process.env.DB_NAME || 'not set',
    DB_PORT: process.env.DB_PORT || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set'
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
    } : false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // enableKeepAlive: true,
    // keepAliveInitialDelay: 0,
    // debug模式=debug: process.env.NODE_ENV === 'development'
    // debug: false, 
});

const promisePool = pool.promise();

// 的連接測試
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1');
            console.log('資料庫連接成功！');
            
            // // 測試資料庫是否存在所需的表
            // const [tables] = await promisePool.query(`
            //     SELECT TABLE_NAME 
            //     FROM information_schema.TABLES 
            //     WHERE TABLE_SCHEMA = ?
            // `, [process.env.DB_NAME]);
            return true;
    } catch (error) {
        console.error('資料庫連接測試失敗:', error);
        throw error;
    }
};

// 執行連接測試
testConnection()
    .catch(err => {
        console.error('初始化資料庫連接失敗:', err);
        process.exit(1);
    });

module.exports = {
    pool:promisePool,
    testConnection
};
pool.on('connection', (connection) => {
    console.log('📦 新的資料庫連線已建立', {
        時間: new Date().toLocaleString('zh-TW'),
        執行緒ID: connection.threadId
    });
});

pool.on('error', (err) => {
    console.error('💥 資料庫錯誤:', {
        時間: new Date().toLocaleString('zh-TW'),
        錯誤: err.message,
        代碼: err.code
    });
});
if (process.env.NODE_ENV === 'development') {
    console.log('資料庫配置檢查完成');
}