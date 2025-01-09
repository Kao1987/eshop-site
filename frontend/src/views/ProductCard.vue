<!-- frontend/src/views/ProductCard.vue -->
<template>
        <div class="product-card">
            <router-link :to="{name: 'ProductDetail',params:{id:productId}}">
                <img :src="productImageUrl" class="product-image" alt="Product Image" @error="imageError">
                <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
                <p class="card-text">{{ formattedPrice }} 元</p>  
            </router-link>
            <button class="btn btn-primary" 
            @click="handleAddToCart"
            :disabled="isAdding"
            >{{ isAdding ? '添加中...' : '加入購物車' }}
        </button>
        </div>
</template>
    
<script>
import { computed , ref } from 'vue';
import ApiService from '@/services/api';
import { getImageUrl } from '@/utils/imageUrl';

export default {
    name: 'ProductCard',
    props: {
        product: {
        type: Object,
        required: true,
            validator: function(obj) {
                const requiredFields = ['id', 'name', 'price', 'image'];
                const hasAllFields = requiredFields.every(field => field in obj);
                if (!hasAllFields) return false;
                // 檢查資料型別和值
                return (
                    typeof obj.id === 'string' || typeof obj.id === 'number' &&
                    typeof obj.name === 'string' && obj.name.trim() !== '' &&
                    typeof obj.price === 'number' && obj.price >= 0 &&
                    typeof obj.image === 'string' && obj.image.trim() !== ''
                );
            }
        }
    },
    setup(props, {emit}) {
        // 計算屬性
        const isAdding = ref(false);
        const hasError = ref(false);
        const productId = computed(() => String(props.product.id).trim());
        const productImageUrl = computed(() => getImageUrl(props.product.image,'product'));
        const formattedPrice = computed(() =>{
        const price = parseFloat(props.product.price);
            return isNaN(price) 
            ? '0 元' 
            : new Intl.NumberFormat('zh-TW', { 
                style: 'currency', 
                currency: 'TWD', 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            }).format(price);
        })
        const handleAddToCart = () => {
            if(isAdding.value) return;

            isAdding.value = true;
            emit('add-to-cart',props.product);

            setTimeout(() => {
                isAdding.value = false;
            }, 1000); // 1 秒後重製按鈕
        };
        const imageError = (event) => {
            if(!hasError.value){
                hasError.value = true;
                event.target.src = getImageUrl('','icon'); // 預設圖片
            }
        };

        return {
        isAdding,
        productId,
        productImageUrl,
        formattedPrice,
        handleAddToCart,
        imageError
        };
    }
}
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
    border-radius: 8px;
    transition: transform 0.3s ease;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.product-name {
    font-size: 1rem;
    margin: 0.5rem 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
.product-name:hover {
    cursor: pointer;
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
