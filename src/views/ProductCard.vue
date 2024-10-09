<template>
        <div class="product-card">
            <router-link :to="{name: 'ProductDetail',params:{id:productId}}">
            <img :src="productImagerUrl" class="product-image" alt="Product Image" @error="imageError">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.price }} 元</p>  
            </router-link>
            <button class="btn btn-primary" @click="AddToCart">加入購物車</button>
        </div>
</template>
    
<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'ProductCard',
    props: {
        product: {
        type: Object,
        required: true,
        validator: function(obj) {
            return obj.id && obj.name && obj.price;
        }
        }
    },
    setup(props) {
        const store = useStore();

        // 計算屬性
        const productId = computed(() => String(props.product.id).trim());
        const productImagerUrl = computed(() => `/img/product/${props.product.image}`);

        // 方法
        const addToCart = () => {
        const isLoggedIn = store.state.auth.isLoggedIn;
        
        if (!isLoggedIn) {
            store.dispatch('showLoginModal', true); // 假設你有一個顯示登錄模態框的 action
            return;
        }

        store.dispatch('cart/addToCart', props.product);
        store.dispatch('showNotification', {
            type: 'success',
            message: `已將 ${props.product.name} 加入購物車`
        });
        };

        const imageError = (event) => {
        event.target.src = '/img/wrong.png'; // 預設圖片
        };

        return {
        productId,
        productImagerUrl,
        addToCart,
        imageError
        };
    }
};
</script>

<style scoped>
.product-card {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
}
.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 10px;
}
.btn-primary {
    background-color: #007bff;
    border: none;
    color: white;
}
</style>
