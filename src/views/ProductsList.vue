<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-3">
                <h4>篩選條件</h4>
                <div>
                    <label>價格區間</label>
                    <input type="range" v-modal="priceRange" min="0" max="10000" />
                    <p>價格：{{ priceRange元 }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="container mt-5">
        <h2 class="mb-4">商品列表</h2>
        <div class="row">
            <div class="col-md-3 mb-4" v-for="product in filteredProducts" :key="product.id">
                <div class="card h-100">
                    <div class="card-body">
                    <h5 class="card-title">{{product.name }}</h5>
                    <p class="card-text">{{ product.price }}元</p>
                    <a href="#" class="btn btn-primary">加入購物車</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    name: 'ProductsList',

data() {
    return {
        products: [
        { id: 1, name: '產品 1', image: 'product1.jpg', price: 1000 },
        { id: 2, name: '產品 2', image: 'product2.jpg', price: 1500 },
        { id: 3, name: '產品 3', image: 'product3.jpg', price: 2000 },
// 更多產品
        ],
        searchQuery: " ",
        priceRange: 10000,
    };
},
    computed: {
        filteredProducts(){
            return this.products.filter(product => {
                return product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && product.price <= this.priceRange;
            });
        }
    }

};
</script>

<style scoped>
/* 自定義樣式 */
</style>
