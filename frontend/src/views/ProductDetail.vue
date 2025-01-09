<!-- frontend/src/views/ProductDetail.vue -->
<template>
<div class="product-detail-page">
    <div class="container py-5">
    <!-- 新增麵包屑導航 -->
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/" class="text-decoration-none">首頁</a></li>
        <li class="breadcrumb-item"><a href="/products" class="text-decoration-none">商品列表</a></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product?.name || '商品詳情' }}</li>
        </ol>
    </nav>

    <div v-if="product && product.id" class="product-detail">
        <div class="row g-4">
        <!-- 左側圖片區域 -->
        <div class="col-lg-6">
            <div class="sticky-top" style="top: 2rem;">
            <div class="image-container">
                <img 
                :src="$getImageUrl(product.image, 'product')"
                :alt="product.name" 
                class="product-image"
                @error="handleImageError"
                >
            </div>
            <!-- 新增縮圖預覽區 -->
            <div class="thumbnail-container mt-3 d-flex gap-2">
                <div v-for="n in 4" :key="n" class="thumbnail-item">
                <img 
                    :src="$getImageUrl(product.image, 'product')"
                    :alt="`${product.name} - 預覽圖 ${n}`"
                    class="thumbnail"
                    @error="handleImageError"
                >
                </div>
            </div>
            </div>
        </div>

        <!-- 右側商品資訊區域 -->
        <div class="col-lg-6">
            <div class="product-info-container">
            <!-- 商品基本資訊 -->
            <div class="product-header mb-4">
                <h2 class="product-name text-break mb-3">{{ product.name }}</h2>
                <div class="product-meta d-flex align-items-center gap-3 mb-3">
                <span class="product-sku text-muted">商品編號: #{{ product.id }}</span>
                <span class="product-category text-muted">分類: 一般商品</span>
                </div>
                <h3 class="product-price mb-0">NT$ {{ product.price }}</h3>
            </div>

            <!-- 商品描述 -->
            <div class="product-description-section mb-4">
                <h4 class="section-title mb-3">商品描述</h4>
                <p class="product-description text-break">{{ product.description }}</p>
            </div>

            <!-- 購買區域 -->
            <div class="purchase-section">
                <div class="quantity-selector mb-4">
                <label class="form-label">數量</label>
                <div class="input-group" style="width: 150px;">
                    <button class="btn btn-outline-secondary" @click="decreaseQuantity">-</button>
                    <input type="number" class="form-control text-center" v-model="quantity" min="1">
                    <button class="btn btn-outline-secondary" @click="increaseQuantity">+</button>
                </div>
                </div>

                <!-- 操作按鈕 -->
                <div class="action-buttons d-grid gap-3">
                <button class="btn btn-primary btn-lg" @click="addToCart">
                    <i class="fas fa-shopping-cart me-2"></i>加入購物車
                </button>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-lg flex-grow-1">
                    <i class="far fa-heart me-2"></i>加入收藏
                    </button>
                    <button class="btn btn-outline-secondary btn-lg flex-grow-1" @click="goBack">
                    <i class="fas fa-arrow-left me-2"></i>返回
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>

    <!-- 載入中狀態 -->
    <div v-else class="loading">
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">正在加載...</span>
        </div>
        <p>正在加載商品中...</p>
    </div>
    </div>
</div>
</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute,useRouter} from 'vue-router';
import { getImageUrl } from '@/utils/imageUrl';


export default {
    name: 'ProductDetail',
    setup(){
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const hasError = ref(false);
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
                const productData = await ApiService.productAPI.getProductById(productId.value);
                // 處理圖片路徑
                product.value = {
                    ...productData,
                    image:getImageUrl(productData.image,'product'),
                };
            }catch(error){
                console.error("加載商品詳情時出錯",error);
                notifiy('error','加載商品詳情失敗，請稍後再試！');
            }
        };
        const handleImageError = (event) => {
            if(!hasError.value) {
                hasError.value = true;
                event.target.src =getImageUrl('','icon');
            }
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

            const quantity = ref(1);
            
            const increaseQuantity = () => {
            quantity.value++;
            };
            
            const decreaseQuantity = () => {
            if (quantity.value > 1) {
                quantity.value--;
            }
            };

            onMounted(fetchProduct);

            return {
                addToCart,
                goBack,
                product,
                productId,
                productImageUrl,
                handleImageError,
                quantity,
                increaseQuantity,
                decreaseQuantity,
                getImageUrl,
            };
    },
};
</script>

<style scoped>
.product-detail-page {
background-color: #f8fafc;
min-height: 100vh;
}

.product-detail {
background-color: #ffffff;
padding: 2rem;
border-radius: 1rem;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.image-container {
background-color: #fff;
padding: 1rem;
border-radius: 0.75rem;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.product-image {
width: 100%;
height: auto;
aspect-ratio: 1;
object-fit: contain;
border-radius: 0.5rem;
}

.thumbnail-container {
overflow-x: auto;
scrollbar-width: none;
-ms-overflow-style: none;
}

.thumbnail-container::-webkit-scrollbar {
display: none;
}

.thumbnail-item {
flex: 0 0 80px;
height: 80px;
border-radius: 0.5rem;
overflow: hidden;
cursor: pointer;
border: 2px solid transparent;
transition: border-color 0.2s ease;
}

.thumbnail-item:hover {
border-color: #2563eb;
}

.thumbnail {
width: 100%;
height: 100%;
object-fit: cover;
}

.product-info-container {
height: 100%;
display: flex;
flex-direction: column;
}

.section-title {
font-size: 1.25rem;
font-weight: 600;
color: #374151;
}

.product-name {
font-size: 2rem;
font-weight: 700;
color: #111827;
line-height: 1.3;
}

.product-meta {
font-size: 0.875rem;
}

.product-price {
font-size: 2.25rem;
font-weight: 700;
color: #e11d48;
}

.product-description {
font-size: 1rem;
line-height: 1.7;
color: #4b5563;
}

.btn-lg {
padding: 0.875rem 1.5rem;
font-size: 1rem;
font-weight: 500;
}

.btn-primary {
background-color: #2563eb;
border-color: #2563eb;
}

.btn-primary:hover {
background-color: #1d4ed8;
border-color: #1d4ed8;
transform: translateY(-1px);
}

.btn-outline-primary {
color: #2563eb;
border-color: #2563eb;
}

.btn-outline-primary:hover {
background-color: #2563eb;
color: white;
transform: translateY(-1px);
}

/* 響應式調整 */
@media (max-width: 991.98px) {
.sticky-top {
    position: relative;
    top: 0 !important;
}

.product-info-container {
    margin-top: 2rem;
}
}

@media (max-width: 767.98px) {
.product-detail {
    padding: 1rem;
}

.product-name {
    font-size: 1.5rem;
}

.product-price {
    font-size: 1.75rem;
}
}
</style>
