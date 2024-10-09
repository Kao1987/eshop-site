<template>
<div class="container mt-5">
    <h2 class="text-center mb-4">新增商品</h2>
    <form @submit.prevent="createProduct">
    <div class="mb-3">
        <label for="productName" class="form-label">商品名稱</label>
        <input type="text" v-model="productForm.name" class="form-control" required />
    </div>
    <div class="mb-3">
        <label for="description" class="form-label">商品描述</label>
        <textarea v-model="productForm.description" class="form-control" required></textarea>
    </div>
    <div class="mb-3">
        <label for="price" class="form-label">價格</label>
        <input type="number" v-model="productForm.price" class="form-control" required />
    </div>
    <div class="mb-3">
        <label for="stock" class="form-label">庫存</label>
        <input type="number" v-model="productForm.stock" class="form-control" required />
    </div>
    <!-- 品牌選擇 -->
    <div class="mb-3">
        <label for="brand_id" class="form-label">選擇品牌</label>
            <multiselect
            v-model="productForm.brand_id"
            :options="brands"
            label="name"
            placeholder="搜尋或選擇品牌">
            </multiselect>
            <span v-if="!productForm.brand_id && formSubmitted" class="text-danger">請選擇品牌</span>
    </div>
    <div class="mb-3">
            <label for="tag_ids" class="form-label">選擇標籤</label>
            <multiselect 
                v-model="productForm.tag_ids" 
                :options="tags" 
                label="name"
                :multiple="true"
                placeholder="搜尋或選擇標籤"
            ></multiselect>
            <span v-if="!productForm.tag_ids.length && formSubmitted" class="text-danger">請選擇至少一個標籤</span>
    </div>
    <!-- 圖片選擇功能 -->
    <div class="mb-3">
        <label for="productImage" class="form-label"></label>
        <input type="file" class="form-control" id="productImage" @change="selectImage" accept="image/*"/>
    </div>
    <!-- 圖片預覽功能 -->
    <div v-if="productForm.imagePreview">
        <h5>圖片預覽</h5>
        <img :src="productForm.imagePreview" alt="商品圖片" style="max-width:200px;"/>
    </div>
    <button type="submit" class="btn btn-primary">新增商品</button>
    </form>
</div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
name: 'CreateProduct',
components: {
    Multiselect,
},
data() {
    return {
    productForm: {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        brand_id: null,
        tag_ids:[],
        created_at: '',
        imageFile: null,
        imagePreview: '',
    },
    brands:[],
    tags: [],
    formSubmitted: false,
    };
},
mounted() {
    this.loadBrands();
    this.loadTags();
},
methods: {
    // 加載品牌資料 
    async loadBrands() {
    try {
        const response = await axios.get('/api/brands');
        this.brands = response.data;
    } catch (error) {
        console.error('讀取品牌資料時出錯:', error);
    }
    },
    // 加載標籤資料
    async loadTags() {
    try {
        const response = await axios.get('/api/tags');
        this.tags = response.data;
    } catch (error) {
        console.error('讀取標籤資料時出錯:', error);
    }
    },
    async createProduct() {
        this.formSubmitted = true; //開始表單驗證   
        if(!this.productForm.brand_id || !this.productForm.tag_ids.length) {
            alert('請選擇品牌和標籤');
            return;
        }

    try {
        // 自動添加當前日期作為 created_at
        const currentDate = new Date().toISOString().split('T')[0]; // 獲取當前日期（yyyy-mm-dd 格式）
        this.productForm.created_at = currentDate;
        //構建表單數據，使用 FormData 來處理圖片上傳
        const formData = new FormData();
        formData.append('name',this.productForm.name);
        formData.append('description',this.productForm.description);
        formData.append('price',this.productForm.price);
        formData.append('stock',this.productForm.stock);
        formData.append('brand_id', this.productForm.brand_id);
        formData.append('tag_ids', JSON.stringify(this.productForm.tag_ids.map(tag => tag.id || tag)));
        formData.append('created_at', this.productForm.created_at);
         // 添加圖片檔案
        if (this.productForm.imageFile) {
                formData.append('image', this.productForm.imageFile);
        }

        // 發送 POST 請求到後端
        const response = await axios.post('/api/products',formData, {
            headers:{
                'Content-Type':'multipart/form-data',
            },
        }); 
        console.log('伺服器回應：',response.data);
        alert('商品新增成功');
        this.$router.push('/admin/products'); // 回到商品列表頁面
    } catch (error) {
        console.error('新增商品時出錯:', error);
        alert('新增商品失敗，請稍後再試');
    }
    },
    // 圖片選擇功能
    selectImage(event){
        const file = event.target.files[0];
        if(file) {
            // 將選取的圖片轉存路徑，儲存在public/img/public下
            this.productForm.imageFile = file;
            // 預覽圖片
            this.productForm.image = URL.createObjectURL(file);
        }
    },

}
};
</script>

<style scoped>
.container {
max-width: 600px;
margin: 0 auto;
}
</style>
