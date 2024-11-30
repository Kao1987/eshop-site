// backend/db.js
require('dotenv').config();
const  mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

pool.getConnection()
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((err) => {
    console.error('資料庫連線失敗：', err);
  });

module.exports = pool;
