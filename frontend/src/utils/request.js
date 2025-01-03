// src/utils/request.js
import axios from 'axios';
import store from '@/store';
import router from '@/router';

const request = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 10000,
    withCredentials: true
});

// 請求攔截器
request.interceptors.request.use(
    config => {
        console.log('🚀 發送請求:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    error => {
            return Promise.reject(error);
        
    }
);

// 響應攔截器
request.interceptors.response.use(
    response => {
        console.log('✅ 成功回應:', {
            url: response.config.url,
            method: response.config.method,
            baseURL: response.config.baseURL,
            data: response.config.data,
            status: response.status
        });
        return response.data;
    },
    error => {
        if(error.response){
            console.log('✅ 收到回應:', {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL,
                headers: error.config?.headers,
                data: error.config?.data,
                status: error.response.status,
                statusText: error.response.statusText,
            });
            if(error.response.status === 401){
                alert('登入已過期，請重新登入');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                router.push('/UserLogin');
            }
        }else{
            console.error('❌ 無法取得有效回應:', error.message);
        }

        // 如果不是登入或註冊請求，則添加 Authorization 標頭
        const isAuthRoute = error.config?.url.includes('/login') || error.config?.url?.includes('/register');
        const token = localStorage.getItem('authToken');
        if(token &&!isAuthRoute && error.config){
            error.config.headers['Authorization'] = `Bearer ${token}`;
        }
        if(error.config && !error.config.headers['Content-Type']){
            error.config.headers['Content-Type'] = 'application/json';
        }
        console.error('❌ 請求發送失敗:', error);
        return Promise.reject(error);
    },
);
export default request;
