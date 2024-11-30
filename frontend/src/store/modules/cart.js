// src/store/modules/cart.js

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        cartItems: state => state.items,
        cartTotal: state => state.items.reduce((total, item) => 
            total + item.price * item.quantity, 0),
        cartItemCount: state => state.items.reduce((total, item) => 
            total + item.quantity, 0)
    },
    mutations: {
        addToCart(state, product) {
            const price = Number(product.price);
            if(isNaN(price)){
                console.error('Invalid price value');
                return;
            }
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.items.push({
                    id: product.id,
                    name: product.name,
                    price: price,
                    image: product.image,
                    quantity: 1
                });
            }
        },
        removeFromCart(state, index) {
            state.items.splice(index, 1);
        },
        updateCartItemQuantity(state, { index, quantity }) {
            state.items[index].quantity = quantity < 1 ? 1 : quantity;
        },
        clearCart(state) {
            state.items = [];
        }
    },
    actions: {
        addProductToCart({ commit }, product) {
            if(!product || !product.id){
                console.error('Invalid product data');
                return;
            }
            commit('addToCart', product);
        },
        removeItemFromCart({ commit }, index) {
            commit('removeFromCart', index);
        },
        updateItemQuantity({ commit }, payload) {
            commit('updateCartItemQuantity', payload);
        },
        clearShoppingCart({ commit }) {
            commit('clearCart');
        }
    }
};