<!-- frontend/src/views/MembersPage.vue -->
<template>
    <div class="member-page">
        <div class="container py-4">
            <!-- 會員資訊卡片 -->
            <div class="member-profile mb-4">
                <div class="profile-header d-flex align-items-center">
                    <div class="avatar-circle me-3 position-relative">
                        <span class="initials">{{ getUserInitials }}</span>
                    </div>
                    <div class="profile-info">
                        <p class="member-data">會員帳號 ： {{ userInfo.email }}</p>
                        <div class="button-group">
                            <button class="btn btn-secondary me-2" @click="openEditModal"> 
                                <i class="fas fa-edit me-2"></i>
                                編輯個人資料
                            </button>
                            <!-- 登出按鈕 -->
                            <div>
                                <button class="btn btn-outline-danger" @click="handleLogout">
                                    <i class="fas fa-sign-out-alt me-2"></i>登出
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 主要內容區塊 -->
            <div class="content-tabs mb-4 main-content">
                <ul class="nav nav-pills mb-3" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#profile">
                            <i class="fas fa-user me-2"></i>個人資料
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="pill" data-bs-target="#addresses">
                            <i class="fas fa-map-marker-alt me-2"></i>收件地址
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="pill" data-bs-target="#orders">
                            <i class="fas fa-shopping-bag me-2"></i>訂單記錄
                        </button>
                    </li>
                </ul>
                <div class="tab-content">
                    <!-- 個人資料頁籤 -->
                    <div class="tab-pane fade show active" id="profile">
                        <div class="content-card">
                            <div class="card-body">
                                <div class="content-grid">
                                    <!-- 左側資料 -->
                                    <div class="content-section" > 
                                        <!-- 會員姓名 -->
                                            <div class="info-block">
                                                <div class="info-icon bg-primary-soft">
                                                    <i class="fas fa-user text-primary"></i>
                                                </div>
                                                <div class="info-content">
                                                    <label>會員姓名:</label>
                                                    <p class="mb-0">{{ userInfo.name }}</p>
                                                </div>
                                            </div>
                                        <!-- 聯絡電話 -->
                                            <div class="info-block">
                                                <div class="info-icon bg-success-soft">
                                                    <i class="fas fa-phone text-success"></i>
                                                </div>
                                                <div class="info-content">
                                                    <label>聯絡電話:</label>
                                                    <p class="mb-0">{{ userInfo.phone }}</p>
                                                </div>
                                            </div>
                                    </div> 
                                    <!-- 分隔線 -->
                                    <div class="content-divider">
                                        <div class="vertical-divider"></div>
                                    </div>
                                    <!-- 右側資料 -->
                                    <div class="content-section">
                                        <!-- 電子信箱 -->
                                        <div class="info-block">
                                            <div class="info-icon bg-primary-soft">
                                                <i class="fas fa-envelope text-purple"></i>
                                            </div>
                                            <div class="info-content">
                                                <label>電子信箱:</label>
                                                <p class="mb-0">{{ userInfo.email }}</p>
                                            </div>
                                        </div>
                                        <!-- 聯絡地址 -->
                                            <div class="info-block">
                                                <div class="info-icon bg-warning-soft">
                                                    <i class="fas fa-map-marker-alt text-warning"></i>
                                                </div>
                                                <div class="info-content">
                                                    <label>聯絡地址:</label>
                                                    <p class="mb-0">{{ userInfo.address }}</p>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 編輯會員資料模態視窗 -->
                    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">編輯會員資料</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="saveUserInfo">
                                        <div class="mb-3">
                                            <label for="name">姓名</label>
                                            <input type="text" class="form-control" id="name" v-model="editUserInfo.name">
                                        </div>
                                        <div class="mb-3">
                                            <label for="userEmail" class="form-label">電子郵件</label>
                                            <input type="email" id="userEmail" v-model="editUserInfo.email" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="userPhone" class="form-label">聯絡電話</label>
                                            <input type="text" id="userPhone" v-model="editUserInfo.phone" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="userAddress" class="form-label">聯絡地址</label>
                                            <input type="text" id="userAddress" v-model="editUserInfo.address" class="form-control" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary">保存變更</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 收件地址頁籤 -->
                    <div class="tab-pane fade" id="addresses">
                        <div class="content-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-end mb-3">
                                    <button class="btn btn-primary" @click="addRecipient">
                                        <i class="fas fa-plus me-2"></i>新增地址
                                    </button>
                                </div>
                                <div class="address-list">
                                    <div v-for="(recipient, index) in recipients" 
                                        :key="recipient.id || index"  
                                        class="address-item mb-3 p-3 rounded"
                                    >
                                        <div class="address-content">
                                            <h6 class="mb-2">收件人姓名 ： 
                                                    {{ recipient.name }}</h6>
                                            <p class="mb-1">
                                                <i class="fas fa-phone me-2 text-muted"></i>
                                                聯絡電話 ： 
                                                {{ recipient.phone }}
                                            </p>
                                            <p class="mb-0">
                                                <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                                                收件地址 ： 
                                                {{ recipient.address }}
                                            </p>
                                        </div>
                                        <div class="address-actions">
                                            <button class="btn btn-link" @click="editRecipientInfo(index)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-link text-danger" @click="deleteRecipient(index)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 新增收件人 -->
                    <div class="modal fade" ref="recipientModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">{{ isEditing ? '編輯收件地址' : '新增收件地址' }}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="saveRecipient">
                                        <div class="mb-3">
                                            <label class="form-label">收件人姓名</label>
                                            <input type="text" class="form-control" v-model="editRecipient.name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">聯絡電話</label>
                                            <input type="tel" class="form-control" v-model="editRecipient.phone" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">收件地址</label>
                                            <input type="text" class="form-control" v-model="editRecipient.address" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary">
                                            {{ isEditing ? '更新地址' : '新增地址' }}
                                    </button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 訂單記錄頁籤 -->
                    <div class="tab-pane fade" id="orders">
                        <div class="content-card">
                            <div class="card-body">
                                <div class="order-list">
                                    <div v-for="(order, index) in orders" 
                                         :key="order.id" 
                                         class="order-item"
                                    >
                                        <div class="order-header" @click="toggleOrderDetails(index)">
                                            <div>
                                                <span class="order-id">#{{ order.id }}</span>
                                                <span class="order-date">{{ formateOrderDate(order.created_at) }}</span>
                                            </div>
                                            <div>
                                                <span class="order-amount">NT$ {{ Math.round(order.total).toLocaleString() }}</span>
                                                <i :class="['fas', expandedOrder === index ? 'fa-chevron-up' : 'fa-chevron-down', 'ms-2']"></i>
                                            </div>
                                        </div>
                                        <div v-if="expandedOrder === index" class="order-details">
                                            <div v-for="item in order.items" 
                                                 :key="item.id" 
                                                 class="order-product"
                                            >
                                                <img :src="item.product_image ? `/img/products/${item.product_image}` : '/img/welcome.jpg'"
                                                     :alt="item.name"
                                                     class="product-img"
                                                >
                                                <div class="product-info">
                                                    <h6>{{ item.name }}</h6>
                                                    <p class="mb-0">
                                                        數量：{{ item.quantity }} × NT$ {{ item.price }}
                                                    </p>
                                                </div>
                                                <div class="product-total">
                                                    NT$ {{ (item.quantity * item.price).toLocaleString() }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { Modal } from 'bootstrap';
import {mapState , mapActions} from 'vuex';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler.js';

const {userAPI,recipientAPI} = ApiService;


export default {
    name: "MemberPage",
    data() {
        return {
            showRecipient:false,
            expandedOrder:null,
            isEditing:false,    
            isLoadingRecipients:false,        
            recipients:[],
            editRecipient:{
                name: ' ',
                phone: ' ',
                address:' '  
            },
            editingIndex:-1,
            userInfo:{
                id:null,
                name:" ",
                email:" ",
                phone:'',
                address:'',
                },
            editUserInfo:{
                name:'',
                email:'',
                phone:'',
                address:'',
            },
            orders:[ ],
            };
        },
    computed:{
        ...mapState('auth',{
            isLoggedIn:(state) => state.isLoggedIn,
            user: (state) => state.user || {},
        }),
        filteredOrders() {
        return this.orders.map((order) => ({
            ...order,
            formattedDate: this.formatOrderDate(order.created_at),
        }));
        },
        getUserInitials() {
            return (this.userInfo.name) ? this.userInfo.name.substring(0, 2).toUpperCase() : '??';
        }
    },
    async mounted(){
        try{
            if(!this.isLoggedIn){
                alert('請先登入會員！');
                this.$router.push('/UserLogin');
                return;
            }
            const userId = this.user.id;
            if(userId){
                this.loadUserInfo(userId),
                this.loadOrders(),
                this.loadRecipients(userId)
            }else{
                console.error("用戶ID無效");
                alert("請先登入會員！");
                this.$router.push('/UserLogin');
            }
        }catch(error){
            handleApiError(error,"加載用戶信息失敗，請重試。");
        }

    },
    methods: {
        async loadUserInfo(id){
            try{
                const response = await ApiService.userAPI.getUserInfo(id);
                if(response.success){
                    this.userInfo = response.data;
                    console.log("用戶資料",this.userInfo);
                }else{
                    console.error("加載用戶資料失敗:",response.message);
                }
            }catch (error){
                console.error("加載用戶信息時出錯:", error);
                handleApiError(error, "加載用戶信息失敗，請重試。");
            }
        },
        async loadOrders() {
            try {
                const response = await ApiService.orderAPI.getOrders();
                if (response.success) {
                    this.orders = response;
                }
            } catch (error) {
                console.error('載入訂單失敗:', error);
            }
        },
        
        async loadRecipients(userId) {
            if(!userId) {
                console.error('用戶ID無效');
                return;
            }

            try {
                this.isLoadingRecipients = true;
                const response = await ApiService.recipientAPI.getRecipients(userId);
                this.recipients = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('載入收件人資料失敗:', error);
                handleApiError(error, '載入收件人資料失敗');
                this.recipients = [];
            } finally {
                this.isLoadingRecipients = false;
            }
        },
        isRecipientValid(recipient) {
            const phoneRegex = /^[0-9]{10}$/;
            return recipient.name.trim() && phoneRegex.test(recipient.phone) && recipient.address.trim();
        },
        async saveRecipient() {
            if (!this.isRecipientValid(this.editRecipient)) {
                alert('請檢查收件人資料是否完整且格式正確！');
                return;
            }

            try {
                let response;
                if (this.isEditing) {
                    response = await ApiService.recipientAPI.updateRecipient(
                        this.editRecipient.id, 
                        this.editRecipient
                    );
                    if (response.success) {
                        this.recipients[this.editingIndex] = response.data;
                    }
                } else {
                    response = await ApiService.recipientAPI.addRecipient({
                        ...this.editRecipient,
                        user_id: this.user.id
                    });
                    if (response.success) {
                        this.recipients.push(response.data);
                    }
                }
                this.hideModal();
                alert(this.isEditing ? '收件人資料已更新' : '新增收件人成功');
                await this.loadRecipients(this.user.id);
            } catch (error) {
                handleApiError(error, this.isEditing ? '更新收件人失敗' : '新增收件人失敗');
            }
        },
        async deleteRecipient(index) {
            if (!confirm('確定要刪除此收件人資料？')) return;
            
            try {
                const recipientId = this.recipients[index].id;
                const response = await ApiService.recipientAPI.deleteRecipient(recipientId);
                if (response.success) {
                    this.recipients.splice(index, 1);
                    alert('收件人資料已刪除');
                }
            } catch (error) {
                handleApiError(error, '刪除收件人敗');
            }
        },
        toggleRecipient(){
            this.showRecipient = !this.showRecipient;
        },
        addRecipient(){
            this.isEditing = false;
            this.editRecipient = {name: '',phone: '',address: '' };
            this.showModal();
        },
        editRecipientInfo(index){
            this.isEditing = true;
            this.editingIndex = index;
            this.editRecipient = {...this.recipients[index]};
            this.showModal();
        },
        toggleOrderDetails(index){
            const order = this.orders[index];
            if (!order.items || !order.items.length) {
                alert('該訂單無法顯示細節！');
                return;
            }
            // 確保所有訂單項目數據正確
            const isOrderItemValid = (item) =>
                item.product_name && item.quantity > 0 && item.price >= 0;
            if (!order.items.every(isOrderItemValid)) {
                alert('該訂單數據不完整，無法展開！');
                return;
            }
            this.expandedOrder = this.expandedOrder === index? null : index;
        },
        showModal() {
            if(this.$refs.recipientModal){
                const modal = new Modal(this.$refs.recipientModal);
                modal.show();
            }
        },
        hideModal(){
            const modal = Modal.getInstance(this.$refs.recipientModal);
            if(modal){
                modal.hide();
            }
        },    
        ...mapActions('auth',['logout']),
            async handleLogout(){
                await this.logout();
                alert("已成功登出!");
                this.$router.push("/UserLogin"); // 登出後導向登入頁面
        },
        formatOrderDate(dateString){
            if(!dateString) return'';
            const date = new Date(dateString);
            return date.toLocaleString('zh-TW',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
        },
        getOrderStatusClass(status) {
            const classes = {
                'pending': 'badge bg-warning text-dark',
                'processing': 'badge bg-info text-white',
                'shipped': 'badge bg-primary text-white',
                'completed': 'badge bg-success text-white',
                'cancelled': 'badge bg-danger text-white'
            };
            return classes[status] || 'badge bg-secondary';
        },

        getOrderStatusText(status) {
            const statusMap = {
                'pending': '處理中',
                'processing': '處理中',
                'shipped': '已出貨',
                'completed': '已完成',
                'cancelled': '已取消'
            };
            return statusMap[status] || '未知狀態';
        },
        openEditModal(){
            this.editUserInfo = {...this.userInfo};
            const modal = new Modal(this.$refs.editModal);
            this.$refs.editModal.removeAttribute('aria-hidden');
            modal.show();
        },
        async saveUserInfo(){
            try{
                const userId = this.user.id;
                const response = await ApiService.userAPI.updateUser(userId,this.editUserInfo);
                if(response.success){
                    this.userInfo = response.data;
                    this.hideEditModal();
                    alert("個人資料已更新");
                }
            }catch(error){
                handleApiError(error,"更新個人資料失敗");
                alert('更新會員資料失敗，請稍後再試。');
            }
        },
        hideEditModal(){
            const modal = Modal.getInstance(this.$refs.editModal);
            if(modal){
                modal.hide();
            }
        },
    }
}

</script>
<style scoped>
.container{
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
}
.content-grid{
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(min(100%, 400px), 1fr));
    gap: clamp(1rem, 2vw, 2rem);
    padding: clamp(1rem, 2vw, 1.5rem);
    justify-content: center;
    align-items: center;
}
.content-section{
    display: flex;
    flex-direction: column;
    gap: clamp(1rem, 2vw, 1.5rem);
}
.content-divider{
    display:none;
}
.main-content{
    background-color:lightsteelblue;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 2vw, 1.5rem);

}
.content-card{
    padding: clamp(1rem, 2vw, 1.5rem);
    background-color:lightsteelblue;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border:none;
    height: 100%;
}

.member-data{
    color: #fff;
    font-size: clamp(1.2rem, 4vw, 2rem);
    margin-bottom: 1rem;
}
.member-page {
    min-height: 100vh;
}
.profile-info .button-group{
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}
.profile-card{
    display: flex;
    justify-content: center;
    border:none;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    background:linear-gradient(to bottom, #f8f9fa, #ffffff);
    transition: all 0.3s ease;
}
.info-content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.info-content p{
    font-size: clamp(1rem, 2vw, 1.1rem);
    color: #212529;
    margin:0;
    line-height: 1.5;
    word-break: break-word;
}
.info-content label{
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: #6c757d;
    
}
.info-list{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.info-item{
    display:grid;
    grid-template-columns: 120px 1fr;
    padding: 1rem;
    background:#f8f9fa;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.info-label{
    color: #6c757d;
    font-size: 0.875rem;
}
.info-value{
    color: #2c3e50;
    font-weight: 500;
}
.info-content .info-value{
    font-size: 1.1rem;
    font-weight: 500;
    color: #2c3e50;
    margin:0;
    line-height: 1.5;
}
.info-block{
    display: grid;
    grid-template-columns:auto 1fr;
    align-items: center;
    padding: clamp(1rem, 2vw, 1.5rem);
    gap: 1rem;
    background:#f8f9fa;
    border-radius: 0.8rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e9ecef;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
}
.info-block:hover{
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.info-group label {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}
.info-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
    padding: 1rem;
}
.vertical-divider{
    width: 1px;
    height: 100%;
    background: linear-gradient(
        to bottom,
        transparent,
        rgba(0,0,0,0.1),
        transparent
    );
    margin: 0 auto;
}
.info-icon{
    width: clamp(50px, 5vw, 70px);
    height: clamp(50px, 5vw, 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: all 0.3s ease;
}
.form-group{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.form-label{
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
}
.form-input{
    padding: 0.75rem 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #2c3e50;
    transition: all 0.3s ease;
}
.form-input:focus{
    border-color: #4b6cb7;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(75,108,183,0.25);
}
.member-profile {
    display: flex;
    justify-content: center;
    align-items: center;
    background:linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
    color:white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
}
.member-profile:hover{
    transform: translateY(-5px);
}
.avatar-circle {
    width: 80px;
    height: 80px;
    background:rgba(255,255,255,0.2);
    border: 3px solid rgba(255,255,255,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
}

.initials {
    font-size: 1.8rem;
    font-weight: 700;
    color:white;
    text-shadow: 1 2px 4px rgba(0,0,0,0.1);
}
.profile-info .member-data{
    color:rgba(255,255,255,0.9);
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.nav-pills .nav-link {
    color: #495057;
    border-radius: 0.75rem;
    padding: 1rem 2rem;
    margin: 0 0.5rem;
    transition: all 0.3s ease;
    font-weight: 500;
    background:#f8f9fa;
    justify-content: center;
    align-items: center;
}
.nav-pills{
    justify-content: center;
    align-items: center;
}
.nav-pills .nav-link.active {
    background-color: #4b6cb7;
    color: white;
    box-shadow: 0 4px 10px rgba(75,108,183,0.3);
}

.nav-pills .nav-link:hover:not(.active) {
    background:#e9ecef;
    transform:translateY(-3px);
}
.card {
    background:#fff;
    border: none;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.card-content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.card-title{
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
}
.address-item{
    display: flex;
    align-items: center;
    padding: 1rem;
    background:#f8f9fa;
    border-radius: 0.8rem;
    transition: all 0.3s ease;
}


.address-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.address-item:last-child {
    margin-bottom: 0;
}

.order-item {
    border:none;
    border-radius: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    background:white;
    border-radius: 1rem;
}

.order-header:hover{
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transform:translateY(-3px);
}

.order-details {
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    background:#f8f9fa;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}
.product-img{
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-product {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
}

.product-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-right: 1rem;
}

.product-info {
    flex: 1;
}

.product-total {
    font-weight: 600;
}
.btn{
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}
.btn-primary{
    background-color:#4b6cb7;
    color:white;
}
.btn-primary:hover{
    background:#3b5998;
    transform: translateY(-2px);
}
.btn-secondary{
    background-color:#f8f9fa;
    color:#4a4a4a;
    border: 1px solid #6c757d;
}
.btn-secondary:hover{
    background-color:#e9ecef;
    transform: translateY(-2px);
}
.btn-link {
    color: inherit;
    text-decoration: none;
    padding: 0.25rem;
}

.order-item{
    border:1px solid #e0e0e0;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow: hidden;
}
.order-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:1rem;
    background-color:#f8f9fa;
    cursor: pointer;
}
.order-details{
    padding: 1rem;
    border-top: 1px solid #e9ecef;
}
.btn-link:hover {
    color: #0d6efd;
}
.bg-primary-soft,
.bg-success-soft,
.bg-warning-soft {
    background: rgba(75, 108, 183, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.5rem;
}

@media (max-width: 768px) {
    .nav-pills{
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }
    .content-grid{
        display: block;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
    .info-block{
        width: 100%;
        margin-bottom: 1rem;
        text-align: center;
    }
    .content-divider{
        display: none;
    }
    .member-profile {
        padding: 1.5rem;
    }

    .nav-pills .nav-link {
        white-space: nowrap;
        padding: 0.75rem 1rem;
        margin: 0 0.25rem;
        font-size: 0.9rem;
    }

    .avatar-circle {
        width: 60px;
        height: 60px;
    }

    .initials {
        font-size: 1.25rem;
    }
    .left-column::after{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: linear-gradient(
            to right,
            transparent,
            rgba(0,0,0,0.1),
            transparent
        );
        margin: 1.5rem 0;
    }
}
@media (min-width: 1024px) {
    .content-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
}
</style>
