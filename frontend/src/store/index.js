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

const token = localStorage.getItem('authToken');
const user = localStorage.getItem('user');

if (token && user) {
    store.commit('auth/login', JSON.parse(user));
}

export default store;