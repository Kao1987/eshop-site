<template>
    <div class="container mt-5">
        <div v-if="product && product.id">
            <div class="product-detail">
                <img :src="productImageUrl" alt="Product Image" class="product-image-large">
                <h2>{{ product.name }}</h2>
                <p>{{ product.description }}</p>
                <p>價格：{{ product.price }} 元</p>
                <button class="btn btn-primary" @click="addToCart">加入購物車</button>
            </div>
        </div>
        <div v-else>
            <p>正在加載商品中...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute,useRouter} from 'vue-router';
 
export default {
    name: 'ProductDetail',
    setup(){
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const product = ref(null);
        const productId = computed(()=> route.params.id);
        const productImageUrl = computed(()=> product.value ? `/api/product/${product.value.image}` : '/img/wrong.png');
        const isLoggedIn = computed(()=>store.getters.isLoggedIn);

        const fetchProduct = async() =>{
            try {
                const response = await axios.get(`/api/products/${productId.value}`);
                console.log("API 返回的產品資料：", response.data);
                product.value = response.data;
            } catch (error) {
                console.error("加載商品詳情時出錯", error);
                alert("加載商品詳情時出錯，請稍後再試！");
            }
        };
        const addToCart=()=>{
            if (!isLoggedIn.value) {
                alert('請先登入再加入購物車！');
                const returnPath = route.fullPath;
                router.push({
                    name:'UserLogin',
                    query:{ redirect: returnPath}
                });
                return;
            }
            store.dispatch('cart/addProductToCart',product.value);
            alert(`已將${product.value.name}加入購物車`);
        };
        fetchProduct();

        return {
            addToCart,
            productId,
            productImageUrl
        };
    },
};
</script>

<style scoped>
.product-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.product-image-large {
    width: 300px;
    height: 300px;
    object-fit: cover;
    margin-bottom: 20px;
}
</style>
