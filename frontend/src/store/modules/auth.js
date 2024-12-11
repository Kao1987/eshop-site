// src/store/modules/auth.js
import ApiService from '@/services/api';


export default {
    namespaced: true,
    state: {
        isLoggedIn: false,
        user: null,
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

                if (!data || !data.token) {
                    throw new Error('無法取得用戶資料或 token');
                }


                const { token } = data;
                const {id,name,email,role,phone,address} = data;
                const user = {id,name,email,role,phone,address};
                
                // 儲存 token
                localStorage.setItem('token', token);
                // 儲存用戶資訊
                localStorage.setItem('user', JSON.stringify(user));
                
                commit('login', user);
                return response;
            } catch (error) {
                console.error('登入失敗:', error);
                throw error;
            }
        },
        logout({ commit }) {
            // 處理登出邏輯，例如 API 調用
            commit('logout');
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
