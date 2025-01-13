<!-- frontend/src/views/ProductsList.vue -->
<template>
    <div class="container">
        <div class="mainArea text-center">
            <h2 class="mb-4 section-title">商品列表</h2>
            <h4 class="filter-title">篩選條件</h4>

            <!-- 篩選區域 -->
            <div class="filter-container">
                <!-- 篩選標籤區域 -->
                <div class="col-lg-10 mx-auto">
                    <h4 class="filter-title">選擇標籤</h4>
                    <div class="tag-container">
                        <button 
                        v-for="tag in availableTags" 
                        :key="tag" 
                        @click="toggleTag(tag)"
                        :class="{'btn': true, 'btn-primary': selectedTags.includes(tag), 'btn-outline-primary': !selectedTags.includes(tag)}"
                        class="tag-btn"
                    >
                            {{ tag }}
                        </button>
                    </div>
                </div>
                <!-- 搜尋區域 -->
                <div class="search-bar mb-4">
                    <input type="text" 
                        v-model="searchQuery" 
                        class="form-control" 
                        placeholder="請輸入你想搜尋的關鍵字"
                        >
                </div>
                <!-- 篩選價格-->
                <div class="filter-section mb-4">
                    <div class="price-filter">
                        <label class="price-label">價格區間</label>
                        <input 
                        type="range" 
                        v-model="priceRange" 
                        min="0" :max="maxPrice" 
                        step="500" class="price-slider form-range"
                        />
                        <p class="price-value">現在最高價格：{{ priceRange }}元</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 商品列表區域 -->
    <div v-if="filteredProducts.length ===  0" class="no-products">
        <p style="text-align: center; font-size: 2rem; color:red;">暫無符合條件的商品，請修改查詢條件！</p>
    </div>
    <div class="product-container mt-4">
        <div class="product-grid">
                <div class="product-card-wrapper" v-for="product in filteredProducts" 
                :key="product.id" 
                >
                    <ProductCard 
                    :product="product"
                    @add-to-cart="addToCart"
                    />
                </div>
        </div>
    </div>

</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import ProductCard from './ProductCard.vue';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { getImageUrl } from '@/utils/imageUrl';



export default {
    name: 'ProductsList',
    components: {
        ProductCard,
    },
    setup() {
        // 創建需要的響應式變量
        const products = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const maxPrice = computed(()=>{
            if (!Array.isArray(products.value)) return 1000000;
            const prices = products.value.map(product => Number(product.price));
            return prices.length ? Math.max(...prices) : 1000000;
        });
        const priceRange = ref(maxPrice.value);

        // 響應式變量
        const availableTags = ref([]);
        const selectedTags = ref([]);

        // 獲取需要的工具
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        // 計算屬性
        const isLoggedIn = computed(() => store.state.auth.isLoggedIn);
        const searchQuery = ref('');
        
        const filteredProducts = computed(() => {
            if (!Array.isArray(products.value)) return [];
            return products.value.filter(product => {
                const productPrice = Number(product.price);
                const nameMatch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
                const priceMatch = productPrice <= priceRange.value;
                const productTags = product.tags || [];
                const tagMatch = selectedTags.value.length === 0 || selectedTags.value.some(tag => productTags.includes(tag));
                return nameMatch && priceMatch && tagMatch;
            });
        });
        // 方法
        const loadProducts = async () => {
            loading.value = true;
            error.value = null;

            try {
                const productData = await ApiService.productAPI.getAllProducts();

                if(Array.isArray(productData)){
                    products.value = productData.map((product) => ({ 
                        ...product,
                        id: String(product.id).trim(),
                        price:Number(product.price),
                        tags: Array.isArray(product.tags) ? product.tags : [],
                        image: getImageUrl(product.image,'product'),
                    }))
                }else{
                    products.value =[];
                }
                // console.log('加載後的商品列表:',products.value);
                priceRange.value = maxPrice.value;
                // 獲取所有標籤     
                const tagsSet = new Set();
                products.value.forEach((product) => {
                    if(product.tags && Array.isArray(product.tags)){
                        product.tags.forEach((tag) =>tagsSet.add(tag));
                    }
                });
                availableTags.value = Array.from(tagsSet);
            }
            catch (err) {
                console.error("加載商品時出錯", err);
                error.value = "加載產品時出錯，請稍後再試！";
            } finally {
                loading.value = false;
            }
        };
        const toggleTag = (tag) =>{
            if (selectedTags.value.includes(tag)){
                selectedTags.value = selectedTags.value.filter((t) => t!== tag);
            }else{
                selectedTags.value.push(tag);
            }
        }
        const addToCart = (product) => {
            if (!isLoggedIn.value) {
                // 未登入將跳轉至登入頁面
                store.dispatch('notifications/showNotification', {
                    type: 'warning',
                    message: '請先登入會員再加入購物車！',
                    timeout:2000,
                });
                
                const returnPath = route.fullPath;
                router.push({
                    name: 'UserLogin',
                    query: { redirect: returnPath }
                });
                return;
            }
            // 透過Vuex Action 添加商品到購物車
            store.dispatch('cart/addProductToCart', product);
            // 透過Vuex Action 顯示成功通知
            store.dispatch('notifications/showNotification', {
                type: 'success',
                message: `已將 ${product.name} 加入購物車`,
                timeout:2000,
            });
        };

        // 在組件掛載時加載商品
        onMounted(() => {
            searchQuery.value = route.query.search || '';
            loadProducts().then(() => {
                // console.log('加載後的商品列表:', products.value);
            });
        });
        watch(
            () => route.query.search,
            (newSearch) => {
                searchQuery.value = newSearch || '';
            }
        );

        // 返回模板中需要使用的內容
        return {
            products,
            maxPrice,
            priceRange,
            loading,
            error,
            isLoggedIn,
            filteredProducts,
            availableTags,
            selectedTags,
            searchQuery,
            toggleTag,
            addToCart,
            priceRange,
        };
    }
};
</script>
<style scoped>
.container{
    max-width: 1400px;
    width: 95%;
    margin: 0 auto;
    padding-top: 1rem;
    background-color:aliceblue;
    border-radius: 2rem;
}
.section-title{
    font-size: 2rem;
    color:#2c3e50;
    margin-bottom: 2rem;
}
.filter-title{
    font-size: 1.2rem;
    color:#2c3e50;
    margin-bottom: 1rem;
}
.filter-container{
    width: 100%;
    border-radius: 1rem;
    padding: 0.5rem;
    background-color:#f0f8ff;
}
.product-container{
    background-color: #f0f8ff;
    padding: 1rem;
    border-radius: 1rem;
}
.tag-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap:0.75rem;
    margin-bottom: 1rem;
}
.tag-btn{
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
}
.mainArea{
    justify-content: center;
    flex-wrap: nowrap;
}
.search-bar {
    max-width: 600px;
    margin: 1.5rem auto;
}
.search-input {
    max-width: 100%;
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    border: 1px solid #e0e0e0;
}
.price-filter {
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
}

.price-label {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    display: block;
}

.price-slider {
    width: 100%;
    margin: 1rem 0;
}

.price-value {
    font-size: 2rem;
    color:royalblue;
}
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 1rem;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}
.product-info{
    padding: 1.5rem;
}
.product-name{
    font-size: 1.2rem;
    line-height: 1.5;
    overflow: hidden;
    margin-bottom: 0.5rem;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
}
@media (max-width: 1200px) {

    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    .container {
        padding:1rem;
    }
    
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 1rem;
    }
    
    .section-title {
        font-size: 1.75rem;
    }
    
    .tag-btn {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
    }
}
@media (max-width: 576px) {
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 0.75rem;
    }
    .search-input{
        padding: 0.5rem 1rem;
    }
}
</style>