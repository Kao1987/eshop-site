<!-- frontend/src/views/ProductDetail.vue -->
<template>
    <div class="container mt-5">
        <div v-if="product && product.id" class="product-detail">
            <div class="row">
                <div class="col-md-6">
                    <div class="image-container">
                        <img 
                            :src="$getImageUrl(product.image, 'product')"
                            alt="Product Image" 
                            class="product-image"
                            @error="handleImageError"
                        >
                    </div>
                </div>
                <div class="col-md-6">
                    <h2 class="product-name">{{ product.name }}</h2>
                    <p class="product-description">{{ product.description }}</p>
                    <h4 class="product-price">價格：{{ product.price }} 元</h4>
                    <div class="d-flex mt-4">
                        <button class="btn btn-primary" @click="addToCart">加入購物車</button>
                        <button class="btn btn-secondary ms-2" @click="goBack">返回上一頁</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">正在加載...</span>
            </div>
            <p>正在加載商品中...</p>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { ref, computed, onMounted } from 'vue';
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
        const productImageUrl = computed(()=> {
            if(!product.value) return '/img/wrong.png';
            return product.value.image ? product.value.image : '/img/wrong.png';
        });
        const isLoggedIn = computed(()=>store.state.auth.isLoggedIn);

        const fetchProduct = async() =>{
            if(!isValidProductId(productId.value)){
                notificationTypes('error','商品格式不正確，無法加載商品詳情');
                router.go(-1);
                return;
            }
            try{
                const response = await ApiService.productAPI.getProductById(productId.value);
                // 處理圖片路徑
                product.value = {
                    ...response,
                    image: response.image ? 
                        `${process.env.VUE_APP_PRODUCT_IMAGE_BASE_URL}/${response.image.split('/').pop()}` : 
                        '/img/default-product.jpg'
                };
            }catch(error){
                console.error("加載商品詳情時出錯",error);
                notifiy('error','加載商品詳情失敗，請稍後再試！');
            }
        };
        const handleImageError = (event) => {
            event.target.src = '/img/wrong.png';
        };
        const addToCart=()=>{
            if (!isLoggedIn.value) {
                redirectToLogin();
                return;
                };
                store.dispatch('cart/addProductToCart',product.value);
                notify('success',`已將${product.value.name}加入購物車`);
            };
            
            const isValidProductId = (id) => /^[1-9]\d*$/.test(id);
            const notify = (type, message) => {
                store.dispatch('notifications/showNotification', { type, message });
            };
            const redirectToLogin = () => {
                router.push({ name: 'UserLogin', query: { redirect: route.fullPath } });
            };

            const goBack = () => router.go(-1);

            onMounted(fetchProduct);

            return {
                addToCart,
                goBack,
                product,
                productId,
                productImageUrl,
                handleImageError
            };
    },
};
</script>

<style scoped>

.product-detail {
    background-color:#f9f9f9;
    padding: 30px;
    border-radius:10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);

}
.image-container{
    background-color: #fff;
    padding:15px;
    border-radius: 10px;
    box-shadow:0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
}

.product-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
}
.product-name{
    font-size:2rem;
    margin-bottom: 20px;
    color: #333;
}
.product-description{
    font-size: 1.1rem;
    color:#555;
    line-height: 1.6;
    margin-bottom: 20px;
}
.product-price{
    color:#e63946;
    font-weight: bold;
}
.loading{
    display: flex;
    flex-direction:column;
    align-items: center;
    margin-top:50px;
    color:#555;
}
.loading p {
    margin-top:15px;
    font-size:1.2rem;
}
</style>
