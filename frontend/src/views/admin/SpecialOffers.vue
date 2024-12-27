<template>
    <div class="special-offers-dashboard container mt-5">
        <h2 class="text-center">特價商品管理</h2>
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-success" @click="openCreateSpecialOfferModal">新增特價商品</button>
        </div>
        <!-- 特價商品管理 -->
        <div class="accordion" id="specialOffersAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingSpecialOffers">
                    <button 
                        class="accordion-button collapsed" 
                        type="button"
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapseSpecialOffers" 
                        aria-expanded="true" 
                        aria-controls="collapseSpecialOffers"
                    >
                        特價商品管理
                    </button>
                </h2>            
                <div id="collapseSpecialOffers" class="accordion-collapse collapse show" aria-labelledby="headingSpecialOffers" data-bs-parent="#specialOffersAccordion">
                    <div class="accordion-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>商品名稱</th>
                                    <th>特價價格</th>
                                    <th>倒數時間 (秒)</th>
                                    <th>創建日期</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(offer, index) in specialOffers" :key="offer?.id">
                                    <td>{{ getProductName(offer.product_id) }}</td>
                                    <td>{{ offer.price }}</td>
                                    <td>{{ formatTime(offer.countdown) }}</td>
                                    <td>{{ formatDate(offer.created_at) }}</td>
                                    <td>
                                        <button class="btn btn-warning btn-sm me-2" @click="openEditSpecialOfferModal(index)">編輯</button>
                                        <button class="btn btn-danger btn-sm" @click="deleteSpecialOffer(offer.id, index)">刪除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>    
                    </div>
                </div>    
            </div>
        </div>
    
        <!-- 編輯特價商品的 Modal -->
        <div class="modal fade" tabindex="-1" ref="specialOfferModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? '編輯特價商品' : '新增特價商品' }}</h5>
                        <button type="button" class="btn-close" @click="closeSpecialOfferModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="productSelect" class="form-label">搜尋商品名稱</label>
                            <input  type="text" 
                                    id="productSearch"
                                    class="form-control" 
                                    v-model="productSearchKeyword"
                                    @input="debouncedSearchProducts" 
                                    required/>
                            <ul class="list-group mt-2" v-if="searchResults &&searchResults.length > 0">
                                <li 
                                    class="list-group-item list-group-item-action"
                                    v-for="product in searchResults"
                                    :key="product.id"
                                    @click="selectProduct(product)"
                                >
                                {{ product.name }}
                                </li>
                            </ul>
                            <div v-if="selectedProduct" class="mt-2">
                                <strong>已選擇商品：</strong>{{ selectedProduct.name }}
                                <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="clearSelectedProduct">移除</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="priceInput" class="form-label">特價價格</label>
                            <input type="number" id="priceInput" v-model="specialOfferForm.price" class="form-control" placeholder="請輸入特價價格" required />
                        </div>
                        <div class="mb-3">
                            <label for="createdAtInput" class="form-label">創建日期</label>
                            <input type="date" id="createdAtInput" v-model="specialOfferForm.created_at" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="startTimeInput" class="form-label">開始時間</label>
                            <input type="datetime-local" id="startTimeInput" v-model="specialOfferForm.start_time" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="durationInput" class="form-label">持續時間 (秒)</label>
                            <input type="number" id="durationInput" v-model="specialOfferForm.duration" class="form-control" placeholder="請輸入持續時間" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeSpecialOfferModal">取消</button>
                        <button type="button" class="btn btn-primary" @click="saveSpecialOffer">{{ isEditing ? '保存變更' : '新增特價商品' }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { Modal } from 'bootstrap';
import debounce from 'lodash.debounce';

export default {
    name: 'SpecialOffers',
    data() {
        return {
            specialOffers: [],
            products: [],
            productMap:{},
            specialOfferForm: {
                product_id: '',
                price: '',
                start_time: '',
                duration: '',
                created_at: new Date().toISOString().split('T')[0],
            },
            isEditing: false,
            currentIndex: null,
            productSearchKeyword: '',
            searchResults: [],
            selectedProduct: null,
            countdownIntervals: [],
        };
    },
    mounted() {
        this.loadSpecialOffers();
        this.loadProducts();
        this.debouncedSearchProducts = debounce(this.searchProducts,500);
    },
    beforeUnmount() { 
        this.clearCountdownIntervals();
    },
    methods: {
        // 加載特價商品列表
        async loadSpecialOffers() {
            try {
                const response = await ApiService.specialOffersAPI.getAllSpecialOffers();
                console.log('loadSpecialOffers response:', response); 
                this.specialOffers = response.map(offer => ({
                    ...offer,
                    countdown: Math.floor((new Date(offer.start_time).getTime() + offer.duration * 1000 - Date.now()) / 1000)
                }));
                this.startCountdown();
            } catch (error) {
                handleApiError(error, '加載特價商品時出錯，請稍後再試！');
            }
        },
        // 新增特價商品時搜尋
        async searchProducts() {
            const keyword = this.productSearchKeyword.trim();
            if(keyword){
                try{
                    const response = await ApiService.productAPI.searchProducts({
                        keyword,page:1,limit:10 });
                    this.searchResults = response;
                }catch(error){
                    handleApiError(error, '搜尋商品時出錯，請稍後再試！');
                }
            }else{
                this.searchResults = [];
            }
    
        },
        // 選擇商品
        selectProduct(product){
            this.selectedProduct = product;
            this.specialOfferForm.product_id = product.id;
            this.searchResults = [];
            this.productSearchKeyword = '';
        },
        // 清除選擇的商品
        clearSelectedProduct(){
            this.selectedProduct = null;
            this.specialOfferForm.product_id = '';
        },
        // 加載商品列表以供選擇
        async loadProducts() {
            try {
                const response = await ApiService.productAPI.getAllProducts();
                this.products = response;
                this.productMap = {};
                response.forEach(product => {
                    this.productMap[product.id] = product.name;
                });
            } catch (error) {
                handleApiError(error, '加載商品時出錯，請稍後再試！');
            }
        },
        // 格式化日期
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString();
        },
        // 開啟新增特價商品的 Modal
        openCreateSpecialOfferModal() {
            this.isEditing = false;
            this.specialOfferForm = {
                id: null,
                product_id: '',
                price: 0,
                countdown: 0,
                created_at: ''
            };
            this.selectedProduct = null;
            this.productSearchKeyword = '';
            this.searchResults = [];
            this.$nextTick(() => {
                const modal = new Modal(this.$refs.specialOfferModal);
                modal.show();
            });
        },
        // 開啟編輯特價商品的 Modal
        async openEditSpecialOfferModal(index) {
            this.isEditing = true;
            this.currentIndex = index;
            const offer = { ...this.specialOffers[index] };
            this.specialOfferForm = offer;
            try{
                const response = await ApiService.specialOffersAPI.getSpecialOfferById(offer.id);
                this.selectedProduct = response;
            }catch(error){
                handleApiError(error, '取得商品資訊時出錯，請稍後再試！');
            }
            this.productSearchKeyword = '';
            this.searchResults = [];
            this.$nextTick(() => {
                const modal = new Modal(this.$refs.specialOfferModal);
                modal.show();
            });
        },
        // 獲取商品名稱時根據商品ID
        getProductName(productId){
            return this.productMap[productId] || '未知商品';

        },
        // 關閉特價商品的 Modal
        closeSpecialOfferModal() {
            const modalInstance = Modal.getInstance(this.$refs.specialOfferModal);
            if (modalInstance) {
                modalInstance.hide();
            }
        },
        // 保存或更新特價商品
        async saveSpecialOffer() {
            console.log('FormData',this.specialOfferForm);
            // 表單驗證
            if (!this.specialOfferForm.product_id || 
                this.specialOfferForm.price === undefined || 
                this.specialOfferForm.price === '' || 
                !this.specialOfferForm.start_time || 
                this.specialOfferForm.duration === undefined || 
                this.specialOfferForm.duration === '') 
                {
                alert('請填寫所有必填欄位！');
                return;
                }
            try {
                const formData = {
                    product_id: parseInt(this.specialOfferForm.product_id),
                    price: parseFloat(this.specialOfferForm.price),
                    start_time: new Date(this.specialOfferForm.start_time).toISOString().slice(0, 19).replace('T', ' '),
                    duration: parseInt(this.specialOfferForm.duration)
                }
                console.log('FormData資料:',formData);

                if (this.isEditing) {
                    // 更新特價商品
                    await ApiService.specialOffersAPI.updateSpecialOfferById(this.editingId,formData);
                    alert('特價商品已更新！');
                } else {
                    // 新增特價商品
                    await ApiService.specialOffersAPI.createSpecialOffer(formData);
                    alert('特價商品已新增！');
                    this.closeSpecialOfferModal();
                    this.loadSpecialOffers();

                    this.$store.dispatch('notifications/showNotification',{
                        type: 'success',
                        message:this.isEditing ? '特價商品已更新！' : '特價商品已新增！',
                        timeout: 3000
                    });
                }
                this.closeSpecialOfferModal();
            } catch (error) {
                handleApiError(error, '保存特價商品時出錯，請稍後再試！');
                this.$store.dispatch('notifications/showNotification', {
                    type: 'error',
                    message: '保存失敗，請稍後再試！',
                    timeout: 2000
                });
            }
        },
        // 刪除特價商品
        async deleteSpecialOffer(offerId, index) {
            if (confirm('確定要刪除此特價商品？')) {
                try {
                    await ApiService.specialOffersAPI.deleteSpecialOffer(offerId);
                    this.specialOffers.splice(index, 1);
                    alert('特價商品已刪除！');
                } catch (error) {
                    handleApiError(error, '刪除特價商品時出錯，請稍後再試！');
                }
            }
        },
            // 開始倒數計時
        startCountdown() {
            this.clearCountdownIntervals();
            if (!this.specialOffers || this.specialOffers.length === 0) return;

            this.specialOffers.forEach((offer, index) => {
                if (offer.countdown <= 0) return; // 如果倒數時間已結束，跳過

                const interval = setInterval(() => {
                    if (this.specialOffers[index].countdown > 0) {
                        this.specialOffers[index].countdown -= 1;
                    } else {
                        clearInterval(interval);
                    }
                }, 1000);

                this.countdownIntervals.push(interval);
            });
        },
        // 清除所有倒數計時器
        clearCountdownIntervals() {
            this.countdownIntervals.forEach(interval => clearInterval(interval));
            this.countdownIntervals = [];
        },
        formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        // 格式化日期為 YYYY-MM-DD
        formatDate(date) {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const day = (`0${d.getDate()}`).slice(-2);
            return `${year}-${month}-${day}`;
        },
    }
};
</script>

<style scoped>
.special-offers-dashboard {
    max-width: 1200px;
    margin: 0 auto;
}
.list-group{
    max-height: 200px;
    overflow-y:auto;
}
</style>
