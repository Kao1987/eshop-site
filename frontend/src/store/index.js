// src/store/index.js
import { createStore } from 'vuex';
import cart from './modules/cart';
import auth from './modules/auth';
import notifications from './modules/notifications';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    modules: {
        cart,
        auth,
        notifications
    },
    plugins: [createPersistedState()]
});

// 初始化時讀取 localStorage 中的 token 和 user
const token = localStorage.getItem('authToken');
const user = localStorage.getItem('user');

if (token && user) {
    // 使用 store.commit 而不是直接 commit
    store.commit('auth/login', JSON.parse(user));
}

export default createStore({
    modules: {
        cart,
        auth,
        notifications
    },
    plugins: [createPersistedState()]
});