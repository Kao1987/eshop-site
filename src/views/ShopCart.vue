<template>
    <div class="cart-container container mt-5">
        <h2 class="text-center mb-4">我的購物車</h2>
        <div v-if="cartItems.length === 0" class="text-center">
            <p>購物車是空的。</p>
            <router-link to="/" class="btn btn-primary">去購物</router-link>
        </div>
        <template v-else>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">商品圖片</th>
                        <th scope="col">商品名稱</th>
                        <th scope="col">單價</th>
                        <th scope="col">數量</th>
                        <th scope="col">小計</th>
                        <th scope="col">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in cartItems" :key="item.id">
                        <!-- 商品圖片，若無法家則顯示預設圖片 -->
                        <td>
                            <img :src="item.image" alt="item.name" class="product-image" @error="imageError"/>
                        </td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.price }}元</td>
                        <!-- 使用＠input即時更新數量 -->
                        <td>
                            <input type="number" class="form-control quantity-input" 
                            v-model.number="item.quantity" 
                            @input="updateQuantity(index,item.quantity)" min="1" />
                        </td>
                        <td>{{ item.quantity * item.price }}元</td>
                        <td>
                            <button class="btn btn-danger" @click="removeItem(index)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center mt-4">
                <h4>總計：{{ cartTotal }}元</h4>
                <button class="btn btn-success" @click="checkout">結帳</button>
            </div>
        </template>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: 'ShoppingCart',
    setup() {
        const store = useStore();
        const router = useRouter();

        // 計算屬性
        const cartItems = computed(() => store.state.cart.items);
        const cartTotal = computed(() => store.getters['cart/cartTotal']);
        const isLoggedIn = computed(() => store.state.auth && store.state.auth.isLoggedIn);

        // 方法
        const updateQuantity = (index, quantity) => {
        if (quantity < 1) quantity = 1;
        store.dispatch('cart/updateItemQuantity', { index, quantity });
        };
        const imageError = (event)=>{
            event.target.src='img/wrong.png';
        }

        const removeItem = (index) => {
        store.dispatch('cart/removeItemFromCart', index);
        };

        const checkout = async () => {
        if (!isLoggedIn.value) {
            router.push({ name: 'Login', query: { redirect: '/cart' }});
            return;
        }

        if (cartItems.value.length === 0) {
            store.dispatch('showNotification', {
            type: 'warning',
            message: '購物車是空的，無法結帳！'
            });
            return;
        }

        try {
            const response = await axios.post('/api/orders', {
            items: cartItems.value,
            total: cartTotal.value
            });
            
            store.dispatch('cart/clearShoppingCart');
            store.dispatch('showNotification', {
            type: 'success',
            message: '訂單已成功提交！'
            });
            
            router.push({ 
            name: 'OrderConfirmation', 
            params: { orderId: response.data.orderId }
            });
        } catch (error) {
            console.error('提交訂單時出錯', error);
            store.dispatch('showNotification', {
            type: 'error',
            message: '提交訂單失敗，請稍後再試！'
            });
        }
        };

        return {
        cartItems,
        cartTotal,
        updateQuantity,
        removeItem,
        checkout,
        imageError,
        };
    }
};
</script>

<style scoped>
.cart-container{
    max-width:800px;
    margin:0 auto;
}

.quantity-input{
width:80px;
text-align: center;
}
.table-hover today tr:hover{
    background: #f1f1f1;
}

.product-image{
    width:60px;
    height:60px;
    object-fit:cover;
}

.btn-danger{
    background-color: #dc3545;
}

.btn-success{
    background-color: #28a745;
}
.h4{
    font-weight:bold;
}

input[type="number"]{
    width:80px;
}


</style>
