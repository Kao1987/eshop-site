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
            <Multiselect
            v-model="productForm.brand_id"
            :options="brands"
            :searchable="true"
            :taggable="true"
            label="name"
            key="id"
            valueProp="id"
            placeholder="搜尋或選擇品牌"
            @select="handleBrandSelect"
            @tag="createNewBrand"
            >
            </Multiselect>
            <span v-if="!productForm.brand_id && formSubmitted" class="text-danger">請選擇品牌</span>
    </div>
    <div class="mb-3">
            <label for="tag_ids" class="form-label">選擇標籤</label>
            <Multiselect 
                v-model="productForm.tag_ids" 
                :options="tags" 
                :searchable="true"
                :taggable="true"
                label="name"
                :multiple="true"
                key="id"
                valueProp="id"
                placeholder="搜尋或選擇標籤"
                @select="handleTagSelect"
                @tag="createNewTag"
                >
            </Multiselect>
            <span v-if="!productForm.tag_ids?.length && formSubmitted" class="text-danger">請選擇至少一個標籤</span>
    </div>
    <!-- 圖片選擇功能 -->
    <div class="mb-3">
        <label for="productImage" class="form-label">圖片上傳</label>
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
import {ref, reactive, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';


export default {
    name: 'CreateProduct',
    components: {
            Multiselect,    
    },
    setup() {
        const router = useRouter();
        const productForm = reactive({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            brand_id: null,
            tag_ids:[],
            created_at: new Date().toISOString().split('T')[0],
            imageFile: null,
            imagePreview: '',
        });
        const validateForm = () => {
            if(!productForm.name.trim()){
                alert('商品名稱必填');
                return false;
            }
            if(!productForm.description.trim()){
                alert('商品描述必填');
                return false;
            }
            if(productForm.price <= 0){
                alert('價格必填且需大於 0');
                return false;
            }
            if(productForm.stock <= 0){
                alert('庫存必填且需大於 0');
                return false;
            }
            if(!productForm.brand_id){
                alert('請選擇品牌');
                return false;
            }
            if(!productForm.tag_ids.length){
                alert('請選擇至少一個標籤');
                return false;
            }
            return true;
        };
        const brands = ref([]);
        const tags = ref([]);
        const formSubmitted = ref(false);
        // 加載品牌資料 
        const  loadBrands = async () => {
            try {
                const response = await ApiService.brandAPI.getAllBrands();
                brands.value = response.data;
                console.log('加載的品牌資料:',brands.value);
            } catch (error) {
                handleApiError(error, '讀取品牌資料時出錯，請稍後再試！');
            }
        };
        // 加載標籤資料
        const loadTags = async() => {
            try {
                const response = await ApiService.tagAPI.getAllTags();
                tags.value = response.data;
                console.log('加載的標籤資料:', tags.value);
            } catch (error) {
                handleApiError(error, '讀取標籤資料時出錯，請稍後再試！');
            }
        };
        const handleBrandSelect = (selected) => {
            productForm.brand_id = selected;
            console.log('選擇的品牌:',selected);
        };
        const handleTagSelect = (selected) => {
            if(Array.isArray(selected)){
                productForm.tag_ids = selected;
            }else{
                productForm.tag_ids = [selected].filter(Boolean);
            }
            console.log('選擇的標籤',selected);
        };
        const createNewBrand = async (newBrandName) =>{
            try{
                const response = await ApiService.brandAPI.createBrand(newBrandName);
                const newBrand = response.data;
                brands.value.push(newBrand);
                productForm.brand_id = newBrand.id;
                alert('新品牌已添加');
            }catch(error){
                handleApiError(error, '創建新品牌時出錯，請稍後再試！');
            }
        };
        const createNewTag = async(newTagName)=>{
            try{
                const response = await ApiService.tagAPI.createTag(newTagName);
                const newTag = response.data;
                tags.value.push(newTag);
                productForm.tag_ids.push(newTag.id);
                alert('新標籤已增加');
            }catch(error){
                handleApiError(error, '創建新標籤時出錯，請稍後再試！');
            }
        }
        onMounted(() => {
            loadBrands();
            loadTags();
        });
        const createProduct = async() => {
            formSubmitted.value = true; //開始表單驗證   
            if(!validateForm()){
                return;
            }
            if(!productForm.brand_id || !productForm.tag_ids || productForm.tag_ids.length === 0) {
                alert('請選擇品牌和至少一個標籤');
                return;
            }
            try {
                // 自動添加當前日期作為 created_at
                const formData = new FormData();
                let tagIds = [];
                if(Array.isArray(productForm.tag_ids)){
                    tagIds = productForm.tag_ids.map(tag => {
                        return typeof tag ==='object' ? tag.id : tag;
                    });
                }
                //構建表單數據，使用 FormData 來處理圖片上傳
                formData.append('name',productForm.name);
                formData.append('description',productForm.description);
                formData.append('price',String(productForm.price));
                formData.append('stock',String(productForm.stock));
                formData.append('brand_id', typeof productForm.brand_id ==='object' ?
                                productForm.brand_id.id : productForm.brand_id);
                formData.append('tag_ids', JSON.stringify(tagIds));
                formData.append('created_at', productForm.created_at);
                // 添加圖片檔案
                if (productForm.imageFile) {
                    formData.append('image', productForm.imageFile);
                }
                // 發送 POST 請求到後端
                const response = await ApiService.productAPI.createProduct(formData);
                console.log('伺服器回應：',response.data);
                alert('商品新增成功');
                router.push('/admin/products'); // 回到商品列表頁面
            }catch(error){
                handleApiError(error, '新增商品時出錯，請稍後再試！');
            }finally{
                formSubmitted.value = false;
            }
        };
            // 監聽圖片上傳
            const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if(file && !file.type.startsWith('image/')){
                alert('請上傳正確的圖片格式');
                event.target.value = '';
                return;
            }
            productForm.value.image = file;
        };
        loadBrands();
        loadTags();
        return{
            productForm,
            brands,
            tags,
            formSubmitted,
            createProduct,
            selectImage,
            handleBrandSelect,
            handleTagSelect, 
            validateForm,
            createNewBrand,
            createNewTag,  
        }
    }
}
</script>

<style scoped>
.container {
max-width: 600px;
margin: 0 auto;
}
</style>
