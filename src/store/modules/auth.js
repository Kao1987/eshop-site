// src/store/modules/auth.js

export default {
    namespaced: true,
    state: {
        isLoggedIn: false,
        user:null,
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
        }
        // 其他變更狀態的 mutations
    },
    actions: {
        login({ commit },user) {
            // 處理登入邏輯，例如 API 調用
            commit('login',user);
        },
        logout({ commit }) {
            // 處理登出邏輯，例如 API 調用
            commit('logout');
        }
        // 其他異步操作的 actions
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        user: state => state.user
        // 其他 getters
    }
};
