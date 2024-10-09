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
            <v-select
            :options="brands"
            label="name"
            placeholder="請選擇廠牌"
            :reduce="brand => brand.id"
            @input="updateBrandId"
            required
            >
            </v-select>
        </div>
        <div class="mb-3">
            <label for="productTags" class="form-label">標籤</label>
            <v-select
            options="tags"
            label="name"
            v-model="selectedTags"
            placeholder="請選擇標籤"
            multiple
            :reduce="tag => tag.id"
            @input="updateTagIds"
            >

            </v-select>
        </div>
        <button type="submit" class="btn btn-primary">更新產品</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default{
    name:'EditProduct',
    components:{
        vSelect,
    },
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
            selectedBrand:null,
            selectedTags:[],
        };
    },
    async mounted(){
        await Promise.all([
        this.loadProduct(),
        this.loadBrands(),
        this.loadTags(),
        ]);

    },
    methods:{
        async loadProduct(){
            const productId = this.$route.params.id;
            try{
                const response = await axios.get(`/api/products/${productId}`);
                this.product = response.data;

                this.selectedBrand = this.brands.find(brand => brand.id === this.product.brand_id)||null;
                this.selectedTags = this.tags.filter(tag => this.product.tag_ids.includes(tag.id));
            }catch(error){
                console.error('加載產品時出錯',error);
                alert('加載產品時出錯，請稍候再試！');
            }
        },
        async loadBrands(){
            try{
                const response = await axios.get('/api/brands');
                this.brands = response.data;

                if(this.product.brand_id){
                    this.selectedBrand = this.brands.find(brand => brand.id === this.product.brand.id) || null;
                }
            }catch(error){
                console.error('加載廠牌時出錯',error);
            }
        },
        async loadTags(){
            try{
                const response = await axios.get('/api/tags');
                this.tags = response.data;

                if(this.product.tag_ids.length > 0){
                    this.selectedTags = this.tags.filter(tag => this.product.tag_ids.includes(tag.id));
                }
            }catch(error){
                console.error('加載標籤時錯誤',error);
                alert('加載標籤時出錯，請稍候再試！');
            }
        },
        async updateProduct(){
            try{
                await axios.put(`/api/products/${this.product.id}`,this.product);
                alert('產品更新成功！');
                this.$router.push({name:'AdminProducts'});
            }catch(error){
                console.error('更新商品時出錯',error);
                alert('商品更新失敗！');
            }
        },
        updateBrandId(selectedBrand){
            this.product.brand_id = selectedBrand; 
        },
        updateTagIds(selectedTags){
            this.product.tag_ids = selectedTags;
        },
    },
    watch:{
        brand(newBrands){
            if(this.product.brand_id){
                this.selectedBrand = newBrands.find(brand => brand.id === this.product.brand_id) || null;
            }
        },
        tags(newTags){
            if (this.product.tag_ids.length > 0) {
                this.selectedTags = newTags.filter(tag => this.product.tag_ids.includes(tag.id));
            }
        }
    },  
};
</script>
<style>
.container{
    max-width: 600px;
}
</style>
