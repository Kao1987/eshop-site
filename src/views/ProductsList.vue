<template>
    <div class="container mt-5">
        <div class="row">
            <div class="tag-filter mb-4">
            <h4>選擇標籤</h4>
                <div>
                    <button 
                        v-for="tag in availableTags" 
                        :key="tag" 
                        @click="toggleTag(tag)"
                        :class="{'btn': true, 'btn-primary': selectedTags.includes(tag), 'btn-outline-primary': !selectedTags.includes(tag)}"
                        class="me-2 mb-2"
                    >
                        {{ tag }}
                    </button>
                </div>
            </div>
            <div class="search-bar mb-4">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="搜尋產品...">
            </div>
            <div class="col-md-3">
                <h4>篩選條件</h4>
                <div>
                    <label>價格區間</label>
                    <input type="range" v-model="priceRange" min="0" max="50000" step="500" @input="filterProducts"/>
                    <p>價格：{{ priceRange }}元</p>
                </div>

            </div>
        </div>
    </div>
    <div class="container mt-5">
        <h2 class="mb-4">商品列表</h2>
        <div class="row">
            <div class="col-md-3 mb-4" v-for="product in filteredProducts" :key="product.id">
                    <ProductCard :product="product"/>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import ProductCard from './ProductCard.vue';

export default {
    name: 'ProductsList',
    components: {
        ProductCard,
    },
    setup() {
        // 創建需要的響應式變量
        const products = ref([]);
        const priceRange = ref(50000);
        const loading = ref(false);
        const error = ref(null);

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
            return products.value.filter(product => {
                const productPrice = Number(product.price);
                const nameMatch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
                const priceMatch = productPrice <= priceRange.value;
                const tagMatch = selectedTags.value.length === 0 || selectedTags.value.some(tag => product.tags.includes(tag));
                return nameMatch && priceMatch && tagMatch;
            });
        });

        // 方法
        const loadProducts = async () => {
            loading.value = true;
            error.value = null;

            try {
                const response = await axios.get('/api/products');
                console.log("商品數據:", response.data);
                products.value = response.data.map(product => ({
                    ...product,
                    id: String(product.id).trim(),
                }));
                const tagsSet = new Set();
                products.value.forEach(product => {
                    product.tags.forEach(tag =>tagsSet.add(tag));
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
                selectedTags.value = selectedTags.value.filter(t => t!== tag);
            }else{
                selectedTags.value.push(tag);
            }
        }
        const addToCart = (product) => {
            if (!isLoggedIn.value) {
                // 未登入將跳轉至登入頁面
                store.dispatch('showNotification', {
                    type: 'warning',
                    message: '請先登入會員再加入購物車！'
                });
                
                const returnPath = route.fullPath;
                router.push({
                    name: 'UserLogin',
                    query: { redirect: returnPath }
                });
                return;
            }

            store.dispatch('cart/addToCart', product);
            store.dispatch('showNotification', {
                type: 'success',
                message: `已將 ${product.name} 加入購物車`
            });
        };

        // 在組件掛載時加載商品
        onMounted(() => {
            searchQuery.value = route.query.search || '';
            loadProducts();
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
        };
    }
};
</script>


<style scoped>
/* 自定義樣式 */
</style>
