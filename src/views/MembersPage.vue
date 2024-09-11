<template>
<div class="container mt-5">
    <h2 class="mb-4">會員資料</h2>
    <!--會員基本資料 -->
        <div class="card mb-3">
            <div class="card-body">
            <h5 class="card-title">會員基本資料</h5>
            <p class="card-text">使用者名稱：{{ userInfo.username }} </p>
            <p class="card-text">電子郵件：{{ userInfo.email }} </p>
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
                    <tr v-for="(recipient, index) in userInfo.recipients" :key="index">
                        <td>{{ recipient.name }}</td>
                        <td>{{ recipient.phone }}</td>
                        <td>{{ recipient.address }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" @click="editRecipient(index)">編輯</button>
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
                <tr v-for="(order, index) in userInfo.orders" :key="index">
                    <td>{{ order.orderID }}</td>
                    <td>{{ order.total }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                        <button class="btn btn-link" @click="toggleOrderDetails(index)">展開/收起</button>
                    </td>
                </tr>
                <tr v-if="expanderOrder === index">
                    <td colspan="4">
                        <table class="table">
                            <tbody>
                                <tr v-for="(orderItem, i) in order.items" :key="i">
                                    <td colspan="4">
                                        <strong>商品名稱:</strong>{{ orderItem.name }}
                                        <strong>數量:</strong> {{ orderItem.quantity }}
                                        <strong>價格:</strong> {{ orderItem.price }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- 登出使用者 -->
        <div class="text-end">
        <button class="btn btn-danger" @click="logout">登出</button>
        </div>
    </div>
    <!-- 編輯收件人 -->
    <div class="modal fade" id="recipientModal" tabindex="-1" aria-labelledby="recipientModalLabel" aria-hidden="true">
        <div class="mmodal-dialog">
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
export default {
name: "MemberPage",
data() {
    return {
        showRecipient:false,
        expanderOrder:null,
        isEditing:false,
        editRecipient:{
            name: ' ',
            phone: ' ',
            address:' '  
        },
        editingIndex:-1,
        userInfo:{
            username:"測試用戶",
            email:"test@ecshop.com",
            recipients:[
                {name:"測試收件人1",phone:"0912345678",address:"台北市林森北路"},
                {name:"收件人2",phone:"0987654321",address:"桃園市中央山脈"}
            ],
                orders:[
                    {
                        orderID:12345,total:2000,date:"2024-09-10",
                        items:[{name:"商品1",quantity:2,price:500}]}
                ],
            },
        };
    },
methods: {
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
        this.editRecipient = {...this.userInfo.recipients[index]};
        this.showModal();
    },
    saveRecipient(){
        if(this.isEditing){
            this.userInfo.recipients[this.editingIndex] = {...this.editRecipient };
        }else{
            this.userInfo.recipients.push({...this.editRecipient});
        }
        this.hideModal();
    },
    toggleOrderDetails(index){
        this.expanderOrder = this.expanderOrder === index? null : index;
    },
    showModal() {
        const modal = new Modal(document.getElementById('recipientModal'));
        modal.show();
    },
    hideModal(){
        const modal = Modal.getInstance(document.getElementById('recipientModal'));
        modal.hide();
    },
    logout() {
    // 模擬登出流程
    console.log("已登出");
    this.$router.push("/login"); // 登出後導向登入頁面
    }
}
};
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
</style>