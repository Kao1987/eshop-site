// src/utils/request.js
import axios from 'axios';
import store from '@/store';

const request = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 10000,
    withCredentials: true
});

// 請求攔截器
request.interceptors.request.use(
    config => {
        // 從 localStorage 獲取 token
        const token = localStorage.getItem('authToken');
        
        // 加入調試日誌
        console.log('🚀 發送請求:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers,
            data: config.data
        });

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if(!config.headers['Content-Type']){
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    error => {
        console.error('❌ 請求發送失敗:', error);
        return Promise.reject(error);
    }
);

// 響應攔截器
request.interceptors.response.use(
    response => {
        // 加入調試日誌
        console.log('✅ 收到回應:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response.data;
    },
    error => {
        // 加入錯誤調試日誌
        console.error('❌ 回應錯誤:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            response: error.response?.data
        });

        const { response } = error;
        let message = '發生錯誤';

        if (response) {
            // ... 原有的錯誤處理邏輯 ...
        }else if(error.code === 'ECONNABORTED') {
            message = '請求超時，請稍後再試！';
        }

        return Promise.reject(new Error(message));
    }
);

export default request;