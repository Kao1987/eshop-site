// src/store/index.js
import { createStore } from 'vuex'
import cart from './modules/cart'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'

export default createStore({
    modules:{
        cart,
        auth
    },
    // state() {
    //     return {
    //         cartItems: []
    //     }
    // },
    // getters: {
    //     cartItems: (state) => state.cartItems,
    //     cartTotal: (state) => state.cartItems.reduce((total, item) => 
    //         total + item.price * item.quantity, 0),
    //     cartItemCount: (state) => state.cartItems.reduce((total, item) => 
    //         total + item.quantity, 0)
    // },
    // mutations: {
    //     addToCart(state, product) {
    //         const existItem = state.cartItems.find(item => item.id === product.id)
    //         if (existItem) {
    //             existItem.quantity++
    //         } else {
    //             state.cartItems.push({
    //                 ...product,
    //                 quantity: 1
    //             })
    //         }
    //     },
    //     removeFromCart(state, index) {
    //         state.cartItems.splice(index, 1)
    //     },
    //     updateCartItemQuantity(state, { index, quantity }) {
    //         const item = state.cartItems[index]
    //         if (item) {
    //             item.quantity = Math.max(1, quantity)
    //         }
    //     },
    //     clearCart(state) {
    //         state.cartItems = []
    //     }
    // },
    // actions: {
    //     addProductToCart({ commit }, product) {
    //         commit('addToCart', product)
    //     },
    //     removeItemFromCart({ commit }, index) {
    //         commit('removeFromCart', index)
    //     },
    //     updateItemQuantity({ commit }, payload) {
    //         commit('updateCartItemQuantity', payload)
    //     },
    //     clearShoppingCart({ commit }) {
    //         commit('clearCart')
    //     }
    // },
    plugins: [createPersistedState()]
})