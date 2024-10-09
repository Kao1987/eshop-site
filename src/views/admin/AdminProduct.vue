<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">商品管理</h2>
        <div class="d-flex justify-content-end mb-3">
            <router-link to="/admin/CreateProduct" class="btn btn-success">新增商品</router-link>
            <router-link to="/admin/SpecialOffers" class="btn btn-primary">特價商品管理</router-link>
        </div>
        <!-- 商品管理 -->
        <div v-if="isSectionOpen.products" class="accordion" id="productAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingProducts">
                    <button 
                    class="accordion-button" 
                    type="button"
                    @click="toggleSection('products')"
                    >
                        商品管理
                    </button>
                </h2>            
                <div class="accordion-collapse collapse show" 
                    :class="{show:isSectionOpen.products}"
                        aria-labelledby="headingProducts" 
                        data-bs-parent="#productAccordion">
                    <div class="accordion-body">
                        <!-- 換頁控制區 -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <label for="itemsPerPage">每頁顯示：</label>
                                <select v-model.number="itemsPerPage" id="itemsPerPage">
                                    <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    class="btn btn-primary btn-sm me-2" 
                                    :disabled="currentPage === 1" 
                                    @click="currentPage--"
                                >上一頁
                                </button>
                                <span>第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
                                <button 
                                    class="btn btn-primary btn-sm ms-2" 
                                    :disabled="currentPage === totalPages" 
                                    @click="currentPage++"
                                >下一頁
                                </button>
                            </div>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>商品名稱</th>
                                    <th>價格</th>
                                    <th>庫存</th>
                                    <th>描述</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product,index) in paginatedProducts" :key="product.id">
                                <td>{{ product.name }}</td>
                                <td>{{ product.price }}</td>
                                <td>{{ product.stock }}</td>
                                <td>{{ product.description }}</td>
                                <td>
                                    <router-link :to="{ name:'EditProduct', params: { id: product.id } }" class="btn btn-warning btn-sm" >編輯</router-link>
                                    <button class="btn btn-danger btn-sm ms-2" @click="deleteProduct(product.id, index)">刪除</button>
                                </td>
                                </tr>
                            </tbody>
                        </table>    
                    </div>
                </div>    
            </div>
        </div>
    
        <div class="row mt-5">
            <!-- 標籤管理 -->
            <div class="col-md-6">
                <div class="accordion" id="tagAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTags">
                            <button 
                            class="accordion-button" 
                            type="button" 
                            @click="toggleSection('tags')"
                            >
                                標籤管理
                            </button>
                        </h2>
                        <div class="accordion-collapse collapse" 
                            :class="{show:isSectionOpen.tags}" 
                            aria-labelledby="headingTags" 
                            data-bs-parent="#tagAccordion">
                            <div class="accordion-body">
                                <div class="d-flex justify-content-end mb-3">
                                    <button class="btn btn-success" @click="openCreateTagModal">新增標籤</button>
                                </div>
                                    <table class="table">
                                    <thead>
                                        <tr>
                                            <th>標籤名稱</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                        <tr v-for="(tag, index) in tags" :key="tag.id">
                                            <td>{{ tag.name }}</td>
                                            <td>
                                                <button class="btn btn-warning btn-sm" @click="openEditTagModal(index)">編輯</button>
                                                <button class="btn btn-danger btn-sm ml-2" @click="deleteTag(tag.id, index)">刪除</button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 廠牌管理 -->
            <div class="col-md-6">
                <div class="accordion" id="brandAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingBrands">
                            <button 
                            class="accordion-button" 
                            type="button" 
                            @click="toggleSection('brands')"
                            >
                                廠牌管理
                            </button>
                        </h2>
                        <div class="accordion-collapse collapse"
                            :class="{show:isSectionOpen.brands}" 
                            aria-labelledby="headingBrands" 
                            data-bs-parent="#brandAccordion">
                            <div class="accordion-body">
                                <div class="d-flex justify-content-end mb-3">
                                    <button class="btn btn-success" @click="openCreateBrandModal">
                                    新增廠牌
                                    </button>
                                </div>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>廠牌名稱</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(brand, index) in brands" :key="brand.id">
                                            <td>{{ brand.name }}</td>
                                            <td>
                                            <button class="btn btn-warning btn-sm" @click="openEditBrandModal(index)">編輯</button>
                                            <button class="btn btn-danger btn-sm ml-2" @click="deleteBrand(brand.id, index)">刪除</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 標籤編輯Modal -->
    <div class="modal fade" tabindex="-1" ref="tagModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">編輯標籤</h5>
                    <button type="button" class="btn-close" @click="closeTagModal"></button>
                </div>
                <div class="modal-body">
                    <input type="text" v-model="tagForm.name" class="form-control" placeholder="標籤名稱"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeTagModal">取消</button>
                    <button type="submit" class="btn btn-primary" @click="saveTag">{{ isEditingTag?'保存變更':'新增標籤' }}</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 編輯廠牌的 Modal -->
    <div class="modal fade" tabindex="-1" ref="brandModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">編輯廠牌</h5>
                    <button type="button" class="btn-close" @click="closeBrandModal"></button>
                </div>
                <div class="modal-body">
                    <input type="text" v-model="brandForm.name" class="form-control" placeholder="廠牌名稱" />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeBrandModal">取消</button>
                    <button class="btn btn-primary" @click="saveBrand">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

    export default{
        name:'AdminProducts',
        data(){
            return{
                products:[],
                tags:[],
                brands:[],
                productForm:{name: '',price:0,stock:0,description:'',brand_id:'',tag_ids:[]},
                tagForm:{name:''},
                brandForm:{name:''},
                isEditing: false,
                currentIndex: null,
                isEditingTag: false,
                isEditingBrand: false,
                currentPage:1,
                itemsPerPage:10,
                itemsPerPageOptions:[10,20,50],
                isSectionOpen:{
                    products:true,
                    tags:false,
                    brands:false,
                }
            };
        },
        mounted(){
            this.loadProducts();
            this.loadTags();
            this.loadBrands();

        },
        computed:{
            paginatedProducts(){
                const start = (this.currentPage - 1) * this.itemsPerPage;
                const end = start + this.itemsPerPage;
                return this.products.slice(start, end);
            },
            totalPages(){
                return Math.ceil(this.products.length / this.itemsPerPage);
            }
        },      
        methods:{
            toggleSection(section){
                this.isSectionOpen[section] = !this.isSectionOpen[section];
            },
            // 加載產品列表
            async loadProducts(){
                try{
                    const response = await axios.get(`/api/products`);
                    this.products = response.data;

                    if(this.currentPage > this.totalPages){
                        this.currentPage = this.totalPages || 1;
                    }
                }catch(error){
                    console.error('加載產品時出錯',error);
                    alert('加載產品時出錯，請稍候再試！');
                }
            },
            // 加載標籤列表
            async loadTags(){
                try{
                    const response = await axios.get('/api/tags');
                    this.tags = response.data; 
                }catch(error){
                    console.error('加載標籤時錯誤',error);
                    alert('加載標籤時錯誤，請稍候再試！');
                }
            },
            // 加載廠牌列表
            async loadBrands(){
                try{
                    const response = await axios.get('/api/brands');
                    this.brands = response.data;
                }catch(error){
                    console.error('加載廠牌時出錯',error);
                    alert('加載廠牌時出錯，請稍候再試！');
                }
            },
            // 保存或更新標籤
            async saveTag() {
            try {
                if (this.isEditingTag) {
                    await axios.put(`/api/tags/${this.tagForm.id}`, this.tagForm);
                    this.tags[this.currentIndex] = { ...this.tagForm };
                } else {
                    const response = await axios.post('/api/tags', this.tagForm);
                    this.tags.push(response.data);
                }
            } catch (error) {
                console.error('保存標籤時出錯！', error);
                alert('保存標籤時出錯，請稍候再試');
            }
            this.closeTagModal();
            },
            // 保存或更新廠牌
            async saveBrand() {
            try {
                if (this.isEditingBrand) {
                await axios.put(`/api/brands/${this.brandForm.id}`, this.brandForm);
                this.brands[this.currentIndex] = { ...this.brandForm };
            } else {
                const response = await axios.post('/api/brands', this.brandForm);
                this.brands.push(response.data);
            }
            } catch (error) {
                console.error('保存廠牌時出錯！', error);
                alert('保存廠牌時出錯，請稍候再試');
            }
            this.closeBrandModal();
            },
            //刪除產品
            async deleteProduct(productId, index){
                if(confirm('確定要刪除此商品？')){
                    try{
                        await axios.delete(`/api/products/${productId}`);  //送出刪除request
                        this.products.splice(index,1);  //從列表中刪除此商品
                    }catch(error){
                        console.error('刪除產品時出錯',error);
                        alert('刪除產品時出錯，請稍候再試！');
                    }
                }
            }, 
            //刪除標籤
            async deleteTag(tagId, index) {
            if (confirm('確定要刪除此標籤？')) {
                try {
                await axios.delete(`/api/tags/${tagId}`);
                this.tags.splice(index, 1);
                } catch (error) {
                console.error('刪除標籤時出錯',error);
                alert('刪除標籤時出錯，請稍候再試！');
                }
            }
            },
            //刪除廠牌
            async deleteBrand(brandId, index) {
            if (confirm('確定要刪除此廠牌？')) {
                try {
                await axios.delete(`/api/brands/${brandId}`);
                this.brands.splice(index, 1);
                } catch (error) {
                console.error('刪除廠牌時出錯',error);
                alert('刪除廠牌時出錯，請稍候再試！');
                }
            }
            },
            // 開啟新增或編輯的Modal
            openCreateTagModal(){
                this.isEditingTag = false;
                this.tagForm = { name:''};
                this.$nextTick(()=>{
                    const modal = new Modal(this.$refs.tagModal);
                    modal.show();
                });
            },
            openCreateBrandModal(){
                this.isEditingBrand = false;
                this.brandForm = { name:''};
                this.$nextTick(()=>{
                    const modal = new Modal(this.$refs.brandModal);
                    modal.show();
                });
            },
            openEditTagModal(index) {
            this.isEditingTag = true;
            this.currentIndex = index;
            this.tagForm = { ...this.tags[index] };
            const modal = new Modal(this.$refs.tagModal);
            modal.show();
            },
            openEditBrandModal(index) {
            this.isEditingBrand = true;
            this.currentIndex = index;
            this.brandForm = { ...this.brands[index] };
            const modal = new Modal(this.$refs.brandModal);
            modal.show();
            },

            closeTagModal() {
                const modalInstance = Modal.getInstance(this.$refs.tagModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            },
            // 關閉廠牌 Modal
            closeBrandModal() {
                const modalInstance = Modal.getInstance(this.$refs.brandModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            },
        },
        watch:{
            itemsPerPage(){
                this.currentPage = 1;
            }
        },

};
</script>
<style scoped>
.admin-dashboard{
    max-width:1200px;
    margin:0 auto;
    min-height:100vh;
}
.admin-products{
    max-width:800px;
    margin:0 auto;
}
</style>