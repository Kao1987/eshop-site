// frontend/src/store/modules/auth.js
import ApiService from '@/services/api';
import jwt from 'jsonwebtoken';

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
};


export default {
    namespaced: true,
    state: {
        isLoggedIn: false,
        user: {
            role: '',
        },
        showLoginModal: false,
    },
    mutations: {
        login(state,user) {
            state.isLoggedIn = true;
            state.user = user;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            localStorage.removeItem('user'); 
            localStorage.removeItem('authToken'); 
        },
        setShowLoginModal(state,value){
            state.showLoginModal = value;
        }
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await ApiService.userAPI.login(credentials);
                const { data } = response;
                const decoded = await verifyToken(token, process.env.VUE_APP_JWT_SECRET);


                console.log('Login Response Data:', data); // 調試用日誌

                if (!data || !data.token) {
                    throw new Error('無法取得用戶資料或 token');
                }


                const { token } = data;
                const {id,name,email,role,phone,address} = data;
                const user = {id,name,email,role,phone,address};
                
                // 儲存 token
                if (token) {
                    localStorage.setItem('authToken', token);
                    console.log('authToken stored:', token); 
                } else {
                    console.error('登入成功，但未收到 Token');
                }
                // 儲存用戶資訊
                localStorage.setItem('user', JSON.stringify(user));
                
                console.log('Stored Token:', token);
                console.log('Stored User:', user);

                commit('login', user);
                return response;
            } catch (error) {
                console.error('登入失敗:', error);
                throw error;
            }
        },
        async checkAuthStatus({ commit }) {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));
            // 自動登出
            // if (token && user) {
            //     try {
            //         ApiService.setHeader('Authorization',`Bearer ${token}`);
            //         await ApiService.userAPI.getUserInfo(user.id); // 假設有此 API 用於驗證用戶資訊

            //         // 驗證 token 的 API 請求
            //         commit('login', user);
            //         return true;
            //     } catch (error) {
            //         commit('logout');
            //         localStorage.removeItem('authToken');
            //         localStorage.removeItem('user');
            //         return false;
            //     }
            // }
            commit('logout');
            return false;
        },
        logout({ commit }) {
            // 處理登出邏輯，例如 API 調用
            commit('logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user'); 

        },
        showLoginModal({commit}, value){
            commit('setShowLoginModal',value);
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        user: state => state.user,
        showLoginModal:state => state.showLoginModal,
    }
};
