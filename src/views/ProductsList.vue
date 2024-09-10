<template>
<div class="row">
<ProductCard v-for="product in products" :key="product.id" :product="product" />
</div>
</template>

<script>
import ProductCard from './ProductCard.vue';

    export default {
    name: 'ProductsList',
    components: {
    ProductCard,
    },
data() {
    return {
        products: [
        { id: 1, name: '產品 1', image: 'product1.jpg', price: 1000 },
        { id: 2, name: '產品 2', image: 'product2.jpg', price: 1500 },
        { id: 3, name: '產品 3', image: 'product3.jpg', price: 2000 },
// 更多產品
],};},};
</script>

<style scoped>
/* 自定義樣式 */
</style>
