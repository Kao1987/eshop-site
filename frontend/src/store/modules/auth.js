// src/store/modules/auth.js

export default {
    namespaced: true,
    state: {
        isLoggedIn: false,
        user:null,
        showLoginModal:false,
        // 其他與認證相關的狀態
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

        // 其他變更狀態的 mutations
    },
    actions: {
        login({ commit },user) {
            // 處理登入邏輯，例如 API 調用
            commit('login',user);
            localStorage.setItem('user',JSON.stringify(user));
        },
        logout({ commit }) {
            // 處理登出邏輯，例如 API 調用
            commit('logout');
            localStorage.removeItem('user');
        },
        showLoginModal({commit}, value){
            commit('setShowLoginModal',value);
        },
        // 其他異步操作的 actions
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        user: state => state.user,
        showLoginModal:state => state.showLoginModal,
        // 其他 getters
    }
};
