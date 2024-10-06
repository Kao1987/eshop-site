<template>
        <div class="product-card">
            <img :src="`/img/products/${product.image}`" class="product-image" alt="Product Image">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.price }} 元</p>
            <button class="btn btn-primary" @click="handleAddToCart">加入購物車</button>
        </div>
</template>
    
<script>

export default {
    name: 'ProductCard',
    props:{
        product:{
            type:Object,
            required:true
        }
    },
    mounted(){
        console.log("ProductCard 商品:",this.product);
    },
    methods: {
        handleAddToCart(){
            if(!this.isLoggedIn()){
                alert('請先登入在加入購物車!');
                this.$router.push('/login');
            }else{
                this.$emit('add-to-cart',this.product);
                alert(`已將${this.product.name}加入購物車`);

            }
        },
        isLoggedIn(){
            return !!localStorage.getItem('authToken');
        },
    },
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
