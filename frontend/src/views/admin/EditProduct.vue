<template>
    <div class="container mt-5">
        <h2 class="text-center">編輯產品資訊</h2>
        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">載入中...</span>
            </div>
        </div>
        <form @submit.prevent="updateProduct" v-if="!isLoading">
            <div v-if="productForm.imagePreview" class="text-center mb-4">
                <img :src="productForm.imagePreview" alt="Product Image" class="product-image">
            </div>
            <div class="mb-3">
                <label for="productImage" class="form-label">產品圖片</label>
                <input type="file" id="productImage" class="form-control" @change="selectImage"/>
            </div>
            <div class="mb-3">
                <label for="productName" class="form-label">商品名稱</label>
                <div class="input-group">
                    <input
                type="text"
                id="productName"
                class="form-control"
                v-model="productForm.name"
                :readonly="!editableFields.name"
                required
                />
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('name')">
                    {{ editableFields.name ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">價格</label>
                <div class="input-group">
                <input
                type="number"
                id="productPrice"
                class="form-control"
                v-model="productForm.price"
                :readonly="!editableFields.price"
                required
                />
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('price')">
                    {{ editableFields.price ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <div class="mb-3">
                <label for="productStock" class="form-label">庫存</label>
                <div class="input-group">
                    <input
                type="number"
                id="productStock"
                class="form-control"
                v-model="productForm.stock"
                :readonly="!editableFields.stock"
                required
                />
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('stock')">
                    {{ editableFields.stock ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <div class="mb-3">
                <label for="productDescription" class="form-label">描述</label>
                <div class="input-group">
                <textarea
                type="number"
                id="productDescription"
                class="form-control"
                v-model="productForm.description"
                :readonly="!editableFields.description"
                required
                ></textarea>
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('description')">
                    {{ editableFields.description ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <div class="mb-3">
                <label for="productBrand" class="form-label">廠牌</label>
                <div class="input-group">
                <Multiselect
                    v-model="productForm.brand_id"
                    :options="brands"
                    :searchable="true"
                    label="name"
                    value-prop="id"
                    placeholder="請選擇廠牌"
                    :disabled="!editableFields.brand_id"
                    required
                >
                </Multiselect>
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('brand_id')">
                    {{ editableFields.brand_id ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <div class="mb-3">
                <label for="productTags" class="form-label">標籤</label>
                <div class="input-group">
                <Multiselect
                    v-model="productForm.tag_ids"
                    :options="tags"
                    label="name"
                    value-prop="id"
                    placeholder="請選擇標籤"
                    :disabled="!editableFields.tag_ids"
                    required
                    multiple
                >
                <template #tag="{option, remove}">
                    <span class="custom-tag">
                        {{ option.name }}
                        <button type="button" @click="remove(option)"> X </button>
                    </span>
                </template>
                </Multiselect>
                <button type="button" class="btn btn-outline-secondary" @click="toggleEdit('tag_ids')">
                    {{ editableFields.tag_ids ? '完成' : '修改' }}
                </button>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">更新產品</button>
        </form>
    </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { productAPI } from '@/services/api';
import { orderAPI } from '@/services/api';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { getImageUrl as fetchImageUrl } from '@/utils/imageUrl'; 

export default{
    name:'EditProduct',
    components:{
        Multiselect,
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const productId = route.params.id;
        const isLoading = ref(true);

        const editableFields = reactive({
        name: false,
        price: false,
        stock: false,
        description: false,
        brand_id: false,
        tag_ids: false,
        });

        const toggleEdit = (field) => {
        editableFields[field] = !editableFields[field];
        };


        const productForm =reactive({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            brand_id: null,
            tag_ids: [],
            imageFile:null,
            imagePreview:'',
        });
            const brands = ref([]);
            const tags = ref([]);

            const loadproduct = async() =>{
                try{
                    isLoading.value = true;

                    const [productResponse, brandsResponse, tagsResponse ] = await Promise.all([
                        axios.get(`/api/products/${productId}`),
                        axios.get('/api/brands'),
                        axios.get('/api/tags'),
                    ]);
                    brands.value = brandsResponse.data;
                    tags.value = tagsResponse.data;

                    const product = productResponse.data;
                    productForm.name = product.name;
                    productForm.description = product.description;
                    productForm.price = product.price;
                    productForm.stock = product.stock;
                    productForm.imagePreview = product.image ?  `/${product.image}`: '';

                    if(product.brand_id){
                        productForm.brand_id = Number(product.brand_id);
                    }
                    if(product.tag_ids && Array.isArray(product.tag_ids)){
                        productForm.tag_ids = product.tag_ids.map(id => Number(id));
                    }
                    
                    console.log('成功讀取資料！',{
                        product,
                        selectedBrand:productForm.brand_id,
                        selectedTags:productForm.tag_ids
                    });
                }catch(error){
                    console.error('加載商品訊息時出錯',error);
                    alert('加載商品訊息時出錯，請稍後再試！');
                }finally{
                    isLoading.value = false;
                }
            };
            const updateProduct = async () => {
                try{
                    // 檢查每個必要欄位是否存在
                    if (!productForm.name) {
                        alert('請填寫商品名稱');
                        return;
                    }
                    if (!productForm.description) {
                        alert('請填寫商品描述');
                        return;
                    }
                    if (!productForm.price || isNaN(productForm.price)) {
                        alert('請填寫有效的商品價格');
                        return;
                    }
                    if (!productForm.stock || isNaN(productForm.stock)) {
                        alert('請填寫有效的商品庫存');
                        return;
                    }
                    if (!productForm.brand_id || isNaN(productForm.brand_id)) {
                        alert('請選擇一個有效的廠牌');
                        return;
                    }
                    const formData = new FormData();
                    formData.append('name', productForm.name);
                    formData.append('description', productForm.description);
                    formData.append('price', productForm.price);
                    formData.append('stock', productForm.stock);
                    formData.append('brand_id', productForm.brand_id);
                    formData.append('tag_ids', JSON.stringify(productForm.tag_ids));

                    if(productForm.imageFile){
                        formData.append('image', productForm.imageFile);
                    }
                    // 發送put請求更新商品。
                    await axios.put(`/api/products/${productId}`,formData,{
                        headers:{
                            'Content-Type':'multipart/form-data'
                        }
                    });
                    alert('更新商品成功！');
                    router.push({name:'AdminProducts'});
                }catch(error){
                    console.error('更新商品時出錯:',error);
                    alert('更新商品時出錯，請稍後再試！');
                }
            };
            const selectImage = (event) =>{
                const file = event.target.files[0];
                if(file){
                    productForm.imageFile = file;
                    productForm.imagePreview = URL.createObjectURL(file);
                }
            };
            onMounted(async () =>{
                await loadproduct();
            })

            return{
                productForm,
                brands,
                tags,
                isLoading,
                editableFields,
                toggleEdit,
                updateProduct,
                selectImage,
            };
        }
}
</script>
<style>
.container{
    max-width: 600px;
}
.custom-tag{
    display: inline-flex;
    align-items:center;
    margin:2px;
    padding:4px 6px;
    background-color: #e0e0e0;
    border-radius:4px;
}
.custom-tag button{
    background: none;
    border: none;
    margin-left:4px;
    cursor:pointer;
}
.product-image{
    max-width:300px;
    max-height:300px;
}
</style>
