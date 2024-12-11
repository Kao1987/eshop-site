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
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // debug模式=debug: process.env.NODE_ENV === 'development'
    debug: false, 
});

const promisePool = pool.promise();

// 改進的連接測試
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1 as connection_test');
        if (rows[0].connection_test === 1) {
            console.log('資料庫連接成功！');
            
            // 測試資料庫是否存在所需的表
            const [tables] = await promisePool.query(`
                SELECT TABLE_NAME 
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = ?
            `, [process.env.DB_NAME]);
            
            console.log('現有資料表:', tables.map(table => table.TABLE_NAME));
        }
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

module.exports = promisePool;

if (process.env.NODE_ENV === 'development') {
    console.log('資料庫配置檢查完成');
}