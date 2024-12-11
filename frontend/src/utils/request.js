// src/utils/request.js
import axios from 'axios';
import store from '@/store';

const request = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    withCredentials: true
});

// 請求攔截器
request.interceptors.request.use(
    config => {
        // 從 localStorage 獲取 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);
// 響應攔截器
request.interceptors.response.use(
    response => response.data,
    error => {
        const { response } = error;
        let message = '發生錯誤';

        if (response) {
            switch (response.status) {
                case 401:
                    message = '未授權，請重新登入';
                    // 在此清除 token 並導至登入頁
                    localStorage.removeItem('token');
                    // 假設使用 Vue Router，可導向登入頁面
                    window.location.href = '/UserLogin'; 
                    break;
                case 403:
                    message = '拒絕訪問';
                    break;
                case 404:
                    message = '請求錯誤，未找到該資源';
                    break;
                case 500:
                    message = '伺服器錯誤';
                    break;
                default:
                    message = response.data?.message || '未知錯誤';
            }
        }else if(error.code === 'ECONNABORTED') {
            message = '請求超時，請稍後再試！';
        }

        console.error('Response error:', error);
        return Promise.reject(new Error(message));
    }
);


export default request;