// frontend/src/store/modules/auth.js
import ApiService from '@/services/api';



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
        async login({ commit,dispatch }, credentials) {
            commit('logout');
            try {
                ApiService.setHeader('Authorization','');

                const response = await ApiService.userAPI.login(credentials);
                console.log('完整登入回應:', response);
                if (!response || !response.data) {
                    throw new Error('伺服器回應格式錯誤');
                }
                if (!response.data.token) {
                    throw new Error('未收到認證令牌');
                }
                
                if(!response || !response.data || !response.success){
                    throw new Error('登入失敗');
                }
                const { data } = response;
                console.log('Login Response Data:', data);

                if (!data.token) {
                    throw new Error('無法取得用戶資料或 token');
                }
                const {token , id, name, email, role, phone, address} = data;
                const user = { id, name,email,role,phone,address};
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('authToken stored:', token); 
                console.log('Stored Token:', token);
                console.log('Stored User:', user);
                commit('login', user);
                
                ApiService.setHeader('Authorization', `Bearer ${token}`);
                return response;
            } catch (error) {
                console.error('登入失敗:', error);
                throw error;
            }
        },
        async checkAuthStatus({ commit }) {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                commit('logout');
                return false;
            }
            try {
                ApiService.setHeader('Authorization',`Bearer ${token}`);
                const response = await ApiService.userAPI.getUserInfo(user.id); 
                if(response.success){
                        commit('login', user);
                        return true;
                    }
                    throw new Error('Token 驗證失敗');
            } catch (error) {
                console.error('Token 驗證失敗:', error);
                commit('logout');
                return false;
            }
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
