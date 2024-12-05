# 使用官方的 Node.js 映像作為基礎映像
FROM node:18-alpine AS frontend-build

# 設定工作目錄
WORKDIR /app/frontend

# 複製 package.json 和 yarn.lock（或 package-lock.json）
COPY frontend/package.json frontend/yarn.lock ./

# 安裝依賴項
RUN yarn install

# 複製應用程式的源代碼
COPY frontend/ .

# 構建前端
RUN yarn build && ls dist  # 構建完後檢查 dist 目錄是否存在

# 構建後端
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# 複製後端依賴文件
COPY backend/package.json backend/yarn.lock ./

RUN apk add --no-cache make gcc g++ python3

# 安裝後端生產依賴
RUN yarn install

# 複製後端代碼
COPY backend/ .

# 複製前端構建產物到後端
COPY --from=frontend-build /app/frontend/dist ./public 

# 運行階段
FROM node:18-alpine

WORKDIR /app/backend

# 複製後端代碼
COPY --from=backend-build /app/backend ./

# 安裝依賴
RUN yarn install --production

# 暴露應用程式執行的端口
EXPOSE 5001

# 設定環境變數 
ENV NODE_ENV=production

# 啟動應用程式
CMD ["node", "app.js"]
