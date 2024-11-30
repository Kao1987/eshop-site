// src/store/index.js
import { createStore } from 'vuex';
import cart from './modules/cart';
import createPersistedState from 'vuex-persistedstate';
import auth from './modules/auth';
import notifications from './modules/notifications';

export default createStore({
    modules:{
        cart,
        auth,
        notifications,
    },

    plugins: [createPersistedState()]
})