<template>
<template>
    <div class="container mt-5">
        <h2 class="text-center">編輯產品資訊</h2>
        <form @submit.prevent="updateProduct">
        <div class="mb-3">
            <label for="productName" class="form-label">商品名稱</label>
            <input
            type="text"
            id="productName"
            class="form-control"
            v-model="product.name"
            required
            />
        </div>
        <div class="mb-3">
            <label for="productPrice" class="form-label">價格</label>
            <input
            type="number"
            id="productPrice"
            class="form-control"
            v-model="product.price"
            required
            />
        </div>
        <div class="mb-3">
            <label for="productStock" class="form-label">庫存</label>
            <input
            type="number"
            id="productStock"
            class="form-control"
            v-model="product.stock"
            required
            />
        </div>
        <div class="mb-3">
            <label for="productDescription" class="form-label">描述</label>
            <textarea
            id="productDescription"
            class="form-control"
            v-model="product.description"
            required
            ></textarea>
        </div>
        <div class="mb-3">
            <label for="productBrand" class="form-label">廠牌</label>
            <select
            id="productBrand"
            class="form-select"
            v-model="product.brand_id"
            required
            >
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
            </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="productTags" class="form-label">標籤</label>
            <select
            id="productTags"
            class="form-select"
            v-model="product.tag_ids"
            multiple
            >
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
            </option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">更新產品</button>
        </form>
    </div>
</template>
    
</template>
<script>
import axios from 'axios';

export default{
    nemr:'EditProducts',
    data(){
        return{
            product:{
                id: null,
                name: '',
                price: 0,
                stock: 0,
                description: '',
                brand_id:'',
                tag_ids: [],
            },
            brands: [],
            tags: [],
        };
    },
    mounted(){
        this.loadProduct();
        this.loadBrands();
        this.loadTags();
    },
    methods:{
        async loadProduct(){
            const productId = this.$route.params.id;
            try{
                const response = await axios.get(`/api/products/${productId}`);
                this.product = response.data;
            }catch(error){
                console.error('加載產品時出錯,error');
            }
        },
        async loadBrands(){
            try{
                const response = await axios.get('/api/brands');
                this.brands = response.data;
            }catch(error){
                console.error('加載廠牌時出錯,error');
            }
        },
        async loadTags(){
            try{
                const response = await axios.get('/api/tags');
                this.tags = response.data;
            }catch(error){
                console.error('加載標籤時錯誤,error');
            }
        },
        async updateProduct(){
            try{
                await axios.put(`/api/products/${this.product.id}`,this.product);
                alert('產品更新成功！');
                this.$router.push('/admin/AdminProducts');
            }catch(error){
                console.error('更新商品時出錯,error');
                alert('商品更新失敗！');
            }
        }

    }
};
</script>
<style>
.container{
    max-width: 600px;
}
</style>
