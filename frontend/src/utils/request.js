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
        const user = JSON.parse(localStorage.getItem('user'));


        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // console.log('Authorization Header set:', `Bearer ${token}`);
        }
        if(!config.headers['Content-Type']){
            config.headers['Content-Type'] = 'application/json'; 
            // console.log('Content-Type 設置為預設值: application/json'); // 調試日誌

        }
        // console.log('Request Headers:', config.headers); // 測試 Header 資訊
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
                    message = '未授權或登入已過期，請重新登入';
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    alert(message); // 提示用戶
                    window.location.href = '/UserLogin'; // 導向登入頁面
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