// src/store/index.js
import { createStore } from 'vuex';
import cart from './modules/cart';
import auth from './modules/auth';
import notification from './modules/notification';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    modules: {
        cart,
        auth,
        notification
    },
    plugins: [createPersistedState()]
});