<!-- frontend/src/views/MembersPage.vue -->
<template>
<div class="container mt-5">
    <h2 class="mb-4">會員資料</h2>
    <!--會員基本資料 -->
        <div class="card mb-3">
            <div class="card-body">
            <h5 class="card-title">會員基本資料</h5>
            <p class="card-text">使用者名稱：{{ userInfo.name }} </p>
            <p class="card-text">電子郵件：{{ userInfo.email }} </p>
            <p class="card-text">電話：{{ userInfo.phone }} </p>
            <p class="card-text">住址: {{ userInfo.address }} </p>
            </div>
        </div>
    <!--收件人資料 -->
    <div class="card mb-3">
        <div class="card-body">
            <h5>收件人資料</h5>
            <button class="btn btn-link" @click="toggleRecipient">展開/收起</button>
            <div v-if="showRecipient">
            <table class="table">
                <thead>
                    <tr>
                    <th>收件人名稱</th>
                    <th>聯絡電話</th>
                    <th>地址</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(recipient, index) in recipients" :key="index">
                        <td>{{ recipient.name }}</td>
                        <td>{{ recipient.phone }}</td>
                        <td>{{ recipient.address }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" @click="editRecipientInfo(index)">編輯</button>
                            <button class="btn btn-danger btn-sm" @click="deleteRecipient(index)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button class="btn btn-primary" @click="addRecipient">新增收件人</button>
        </div>
    </div>
    <!-- 訂單查詢 -->
    <div class="mb-3">
        <div class="card-body">
            <h5 class="card-title">訂單查詢</h5>
            <table class="table">
                <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>訂單金額</th>
                    <th>訂購時間</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                    <template v-for="(order,index) in orders" :key="index">
                        <tr >
                            <td>{{ order.id }}</td>
                            <td>{{ Math.round(order.total) }}</td>
                            <td>{{ formateOrderDate(order.created_at) }}</td>
                            <td>
                                <button class="btn btn-link" @click="toggleOrderDetails(index)">展開/收起</button>
                            </td>
                        </tr>
                        <!-- 訂單展開 -->
                        <tr v-if="expandedOrder !==null && expandedOrder === index">
                            <td colspan="4">
                                <div class="order-details">
                                    <div v-for="(orderItem, i) in order.items" :key="i" class="order-item">
                                        <img 
                                        :src="orderItem.product_image || '/default-product-image.png'"
                                        :alt="orderItem.product_name"
                                        class="product-thumbnail"
                                        >
                                        <div class="item-info">
                                            <strong>商品名稱:</strong>{{ orderItem.name }}
                                            <strong>數量:</strong> {{ orderItem.quantity }}
                                            <strong>價格:</strong> {{ orderItem.price }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    <!-- 登出使用者 -->
        <div class="text-end">
        <button class="btn btn-danger" @click="handleLogout">登出</button>
        </div>
    </div>
    <!-- 編輯收件人 -->
    <div class="modal fade" id="recipientModal" ref="recipientModal" tabindex="-1" aria-labelledby="recipientModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="recipientModalLabel">{{ isEditing ? '編輯收件人':'新增收件人' }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="recipientName" class="form-label">收件人名稱</label>
                    <input type="text" class="form-control" v-model="editRecipient.name" />
                </div>
                <div class="mb-3">
                    <label for="recipientPhone" class="form-label">收件人電話</label>
                    <input type="text" class="form-control" v-model="editRecipient.phone" />
                </div>
                <div class="mb-3">
                    <label for="recipientAddress" class="form-label">收件人地址</label>
                    <input type="text" class="form-control" v-model="editRecipient.address" />
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="saveRecipient">{{ isEditing ? '儲存變更':'新增' }}</button>   
        </div>
    </div>
</div>
</div>
</div>
</template>

<script>
import { Modal } from 'bootstrap';
import {mapState , mapActions} from 'vuex';
import axios from 'axios';

export default {
    name: "MemberPage",
    data() {
        return {
            showRecipient:false,
            expandedOrder:null,
            isEditing:false,            
            recipients:[],
            editRecipient:{
                name: ' ',
                phone: ' ',
                address:' '  
            },
            editingIndex:-1,
            userInfo:{
                name:" ",
                email:" ",
                phone:'',
                address:'',
                },
            orders:[ ],
            };
        },
    computed:{
        ...mapState('auth',{
            isLoggedIn:state => state.isLoggedIn,
            user: state => state.user
        })
    },
    mounted(){
        if(!this.isLoggedIn){
            alert('請先登入會員！');
            this.$router.push('/UserLogin');
            return;
        }
            this.loadUserInfo();
            this.loadOrders();
            this.loadRecipients();
        },
    methods: {
        async loadUserInfo(){
            try{
                const userID = this.user.id;
                console.log("用戶 ID:", userID); // 日誌用戶 ID
                if(!userID){
                    console.error("用戶ID無效");  
                    return;
                }
                const response = await axios.get(`/api/users/${userID}`); //請求API
                this.userInfo = response.data;
                console.log("用戶資料",this.userInfo);
            }catch (error){
                console.error("加載用戶信息時出錯:", error);
                console.error('錯誤回應:', error.response);
                console.error('請求細節:', error.config);
                alert("加載用戶信息失敗，請重試。");
            }
        },
        async loadOrders(){
            try{
                const userID = this.user.id;
                console.log("用戶訂單ID：",userID); //檢查用戶
                if(!userID){
                    console.error("用戶ID無效");  
                    return;
                }
                const response = await axios.get(`/api/orders`,{
                    params: {
                        userId: userID
                    }
                });
                this.orders = response.data;   
            }catch(error){
                console.error("加載訂單時出錯：",error);
                alert("加載訂單失敗，請稍候再試");
            }
        },
        async loadRecipients(){
            try{
                const userID = this.user.id;
                const response = await axios.get(`/api/recipients`,{
                    params: {
                        user_id: userID,
                    }
                });
                this.recipients = response.data;
            }catch(error){
                console.error('加載收件人時錯誤：',error);
                alert('加載收件人失敗，請稍候再試。')
            }
        },
        async saveRecipient(){
            try{
                const userID = this.user.id;
                if(this.isEditing){
                    // 編輯收件人
                    await axios.put(`/api/recipients/${this.editRecipient.id}`,{
                        ...this.editRecipient,
                        user_id:userID,
                    });
                    this.recipients[this.editingIndex] = {...this.editRecipient};
                }else{
                    // 新增收件人   
                    const response = await axios.post('/api/recipients',{
                        ...this.editRecipient,
                        user_id: userID,
                    });
                    this.recipients.push(response.data);
                }
                this.hideModal();
            }catch(error){
                console.error("保存收件人時出錯：",error);
                alert("保存收件人失敗，請稍候再試。");
            }
        },
        async deleteRecipient(index){
            try{
                const recipientId = this.recipients[index].id;
                await axios.delete(`/api/recipients/${recipientId}`);
                this.recipients.splice(index,1);
            }catch(error){
                console.error('刪除收件人失敗',error);
                alert('刪除收件人失敗');
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
        formateOrderDate(dateString){
            if(!dateString) return'';
            const date = new Date(dateString);
            return date.toLocaleString('zh-TW',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        },
    }
}
</script>

<style scoped>
    .card {
    margin-bottom: 1rem;
    }

    .search-box {
    margin-bottom: 1rem;
    }

    .table th,
    .table td {
    vertical-align: middle;
    }

    .modal-content {
    padding: 1rem;
    }
    .product-thumbnail {
    max-width: 100px;  /* 限制圖片寬度 */
    max-height: 100px; /* 限制圖片高度 */
    object-fit: cover; /* 保持圖片比例 */
    margin-right: 10px; /* 與文字保持一些間距 */
    }

    .order-item {
        display: flex;      /* 使用 flexbox 佈局 */
        align-items: center; /* 垂直居中 */
        margin-bottom: 10px; /* 項目之間的間距 */
    }

    .item-info {
        flex-grow: 1;
    }
</style>