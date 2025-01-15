# eShop Site

## 專案介紹

eShop 是一個基於前後端分離架構的電子商務網站，設計重點是提供高效能、穩定的購物體驗。
目前尚有許多能完善中，在懇請訪客給予寶貴意見，感謝您。

### 技術架構

- **前端**：使用 [Vue.js](https://vuejs.org/) 和 [Bootstrap 5](https://getbootstrap.com/)，支援響應式設計 (RWD)
- **後端**：採用 [Node.js](https://nodejs.org/) 和 [Express](https://expressjs.com/) 框架
- **資料庫**：使用 [MySQL](https://www.mysql.com/) 作為後端數據儲存
- **部署**：專案部署於 [Google Cloud Platform (GCP)](https://cloud.google.com/) 上

## 安裝指引 (Installation Guide)

### 1. 下載專案

使用以下指令將專案 Clone 到本地：

```bash
git clone https://github.com/Kao1987/eshop-site.git
cd eshop-site
```

### 2. 安裝依賴

執行以下指令安裝前後端依賴：

```bash
yarn install:all
```

### 3. 配置環境變數

根據 `.env.example` 範本創建 `.env` 文件，並填寫必要的配置：

```plaintext
# Database configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=eshop

# Server port
PORT=3306
```

> **注意**：請勿使用生產環境資料庫資訊。

### 4. 啟動專案

開發模式啟動：

```bash
yarn dev
```

服務運行於：
- 前端：http://localhost:8081
- 後端：http://localhost:5002

## 功能簡介

### 會員系統
- 註冊、登入、登出
- 忘記密碼功能
- 會員資料管理

### 購物車系統
- 商品加入購物車
- 修改商品數量
- 移除購物車商品

### 訂單管理
- 訂單查詢功能
- 訂單修改功能
- 訂單取消功能

### 後台管理
- 商品管理功能
- 會員管理功能
- 訂單管理功能
- 銷售數據分析

## 注意事項

1. **環境變數**：確保 `.env` 文件已正確配置，並且未提交到版本庫
2. **資料庫安全**：請勿直接使用生產環境的資料庫資訊
3. **系統需求**：確保開發環境已安裝 Node.js 和 Yarn

---

*更多詳細資訊請參考專案文件或聯繫專案維護者。*
