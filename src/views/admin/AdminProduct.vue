<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">商品管理</h2>
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-success" @click="openCreatProductModal">新增產品</button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>商品名稱</th>
                    <th>價格</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product,index) in products" :key="index">
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" @click="openEditProductModal(index)">編輯</button>
                        <button class="btn btn-danger btn-sm ml-2" @click="deleteProduct(index)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    <!-- 產品新增/編輯 -->
    <div class="modal" tabindex="-1" ref="productModal">
        <div class="Modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditing ? '編輯產品' : '新增產品' }}</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveProduct">
                        <div class="mb-3">
                            <label for="productName" class="form-label">商品名稱</label>
                            <input type="text" 
                                    id="productName" 
                                    class="form-control" 
                                    v-model="productform.name">
                        </div>
                        <div class="mb-3">
                            <label for="productPrice" class="form-label">價格</label>
                            <input
                            type="text"
                            id="productPrice" 
                            v-model="productform.price"
                            class="form-control"
                            required/>
                        </div>
                    </form>
                </div>
                <button type="bitton" class="btn bts-secondary" data-bs-dismiss="modal">取消</button>
                <button type="submit" class="btn btn-primary ml-2" @click="saveProduct">{{ isEditing?'保存變更':'新增產品' }}</button>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
import bootstrap from 'bootstrap';

    export default{
        name:'AdminProducts',
        data(){
            return{
                products:[
                    {name:'商品1',price:100},
                    {name:'商品2',price:200},
                ],
                productform:{
                    name: '',
                    price:0,
                },
                isEditing: false,
                currentIndex: null,
            };
        },
        methods:{
            // 開啟新增商品的彈出視窗
            openCreateProductModal(){
                this.isEditing = false;
                this.productform = {name: '',price: 0};//重製表單
                const modal = new bootstrap.Modal(this.$refs.productModal);
                modal.show();
            },
            // 編輯產品的彈出視窗
            openEditProductModal(index){
                this.isEditing = true;
                this.currentIndex = index;
                this.productform = {...this.products[index]};
                const modal = new bootstrap.Modal(this.$refs.productModal);
                modal.show();
            },
            //保存或更新產品
            saveProduct(){
                if(this.isEditing){
                this.products[this.currentIndex] = {...this.productform}; //更新產品數據
                }else{
                this.products.push({...this.productform});//新增產品
                }
            },  
            //關閉彈出視窗
            closeModal(){
                const modal = new bootstrap.Modal(this.$refs.productModal).hide();
                modal.hide();
            },
            //刪除產品
            deleteProduct(index){
                if(confirm('確定要刪除此商品？')){
                    this.products.splice(index,1);
                }
            },
    },
};
</script>
<style scoped>
.admin-products{
    max-width:800px;
    margin:0 auto;
}
</style>