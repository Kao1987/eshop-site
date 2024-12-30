<!-- frontend/admin/adminUsers.vue -->
<template> 
    <div class="admin-dashboard container py-4">
        <!-- 頁面標題區 -->
        <div class="page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold text-primary mb-1">用戶管理</h2>
                    <p class="text-muted mb-0">管理系統用戶和權限</p>
                </div>
                <button class="btn btn-primary" @click="openCreateUserModal">
                    <i class="fas fa-user-plus me-2"></i>新增用戶
                </button>
            </div>
        </div>
        <!-- 用戶列表卡片 -->
        <div class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3">用戶資訊</th>
                            <th class="py-3">權限</th>
                            <th class="py-3">收件地址</th>
                            <th class="py-3 text-end">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(user,index) in users" :key="index">
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="user-avatar me-3">
                                            {{ getUserInitials(user.name) }}
                                        </div>
                                        <div>
                                            <h6 class="mb-0">{{ user.name }}</h6>
                                            <small class="text-muted">{{ user.email }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span :class="getRoleBadgeClass(user.role)">
                                        {{ getRoleDisplayName(user.role) }}
                                    </span>
                                </td>
                                <td class="address-section">
                                    <div class="d-flex align-items-center">
                                        <button 
                                            class="btn btn-link btn-sm text-decoration-none d-flex align-items-center"
                                            @click.stop="toggleRecipients(index)"
                                            v-if="user.recipients?.length"
                                        >
                                            <span class="me-2">{{ user.recipients ? user.recipients.length : 0 }} 個地址</span>
                                            <i :class="['fas', user.showRecipients ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                        </button>
                                        <span v-else class="text-muted">無收件地址</span>
                                    </div>
                                </td>
                                <!-- 收件地址展開面板 -->
                                <td class="text-end">
                                    <div class="btn-group">
                                        <button 
                                            class="btn btn-outline-primary btn-sm" 
                                            @click="openEditUserModal(index)"
                                            title="編輯用戶"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            class="btn btn-outline-success btn-sm" 
                                            @click="addRecipient(index)"
                                            title="新增收件地址"
                                        >
                                            <i class="fas fa-map-marker-alt"></i>
                                        </button>
                                        <button 
                                            class="btn btn-outline-danger btn-sm" 
                                            @click="deleteUser(index)"
                                            title="刪除用戶"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <!-- 收件人資訊展開區 -->
                            <tr v-if="user.showRecipients  && user.recipients && user.recipients?.length"
                                > 
                                <td colspan="6">
                                    <div class="recipient-list p-3">
                                        <div v-for="(recipient, recipientIndex) in user.recipients" 
                                            :key="recipient.id || recipientIndex"
                                            class="address-item"
                                            >
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <div class="fw-bold">{{ recipient.name }}</div>
                                                    <div class="text-muted small">
                                                        <i class="fas fa-phone me-1"></i>{{ recipient.phone }}
                                                    </div>
                                                    <div class="text-muted small">
                                                        <i class="fas fa-map-marker-alt me-1"></i>{{ recipient.address }}
                                                    </div>
                                                </div>
                                                    <div class="recipient-actions">
                                                        <button 
                                                        class="btn btn-outline-primary btn-sm me-2"
                                                        @click="editRecipient(index, recipientIndex)"
                                                        title="編輯收件人"
                                                        >
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        class="btn btn-outline-danger btn-sm"
                                                        @click="deleteRecipient(index, recipientIndex)"
                                                        title="刪除收件人"
                                                        >
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
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

        <!-- 用戶編輯 Modal -->
        <div class="modal fade" tabindex="-1" ref="userModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">{{ isEditing ? '編輯用戶' : '新增用戶' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveUser" class="needs-validation">
                            <div class="mb-3">
                                <label class="form-label">用戶名稱</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="userForm.name" 
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">電子郵件</label>
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    v-model="userForm.email" 
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">密碼</label>
                                <div class="input-group">
                                    <input 
                                        :type="showPassword ? 'text' : 'password'"
                                        class="form-control" 
                                        v-model="userForm.password"
                                        :required="!isEditing"
                                    />
                                    <button 
                                        type="button" 
                                        class="btn btn-outline-secondary"
                                        @click="showPassword = !showPassword"
                                    >
                                        <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">確認密碼</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    v-model="userForm.confirmPassword"
                                    :required="!isEditing || userForm.password"
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">用戶權限</label>
                                <select class="form-select" v-model="userForm.role">
                                    <option value="user">一般用戶</option>
                                    <option value="admin">管理員</option>
                                </select>
                            </div>
                            <div v-if="userForm.role === 'user'">
                                <div class="mb-3">
                                    <label class="form-label">聯絡電話</label>
                                    <input 
                                        type="tel" 
                                        class="form-control" 
                                        v-model="userForm.phone"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">聯絡地址</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="userForm.address"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-outline-secondary" @click="closeModal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="saveUser">
                            {{ isEditing ? '保存變更' : '新增用戶' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 收件人編輯 Modal -->
        <div class="modal fade" tabindex="-1" ref="recipientModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-0">
                <h5 class="modal-title">{{ isEditingRecipient ? '編輯收件地址' : '新增收件地址' }}</h5>
                    <button type="button" class="btn-close" @click="closeRecipientModal"></button>
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
                </form>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-outline-secondary" @click="closeRecipientModal">取消</button>
                    <button type="submit" class="btn btn-primary" @click="saveRecipient">
                        {{ isEditingRecipient ? '更新地址' : '新增地址' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';



    export default{
        name:'AdminUsers',
        data(){
            return{
                users:[],
                userForm: {
                name: '',
                email: '',
                password:'',
                confirmPassword:'',
                role: 'user',
                phone:'',
                address:''
                },
                isEditing:false,
                currentIndex: null,
                showPassword: false,
                editRecipient: {
                    name: '',
                    phone: '',
                    address: '',
                    user_id: null
                },
                isEditingRecipient: false,
                editingRecipientIndex: -1
            };
        },
        mounted(){
            this.loadUsers();
            document.addEventListener('click', this.handleClick);
        },
        beforeDestroy(){
            document.removeEventListener('click', this.handleClick);
        },
        handleClick(event){
            if(!event.target.closest('.address-section')){
                this.users.forEach(user => {
                    if(user.showRecipients){
                        user.showRecipients = false;
                    }
                });
            }
        },
        // 開啟新增用戶的視窗
        methods:{
            async loadUsers(){
                try{
                    const response = await ApiService.userAPI.getAllUsers();
                    // this.users = response.data.map(user =>({
                    //     ...user,
                    //     showRecipients: false
                    // }))
                    const usersData = response.data;
                    for(let user of usersData) {
                        try {
                            const recipientsResponse = await ApiService.recipientAPI.getRecipients(user.id);
                            user.recipients = recipientsResponse.data || [];
                            user.showRecipients = false;
                        } catch(error) {
                            console.error(`無法加載用戶 ${user.id} 的收件人資料:`, error);
                            user.recipients = [];
                        }
                    }
                    this.users = usersData;
                }catch(error){
                    handleApiError(error, '無法加載用戶資料');
                }
            },
            async deleteRecipient(userIndex, recipientIndex) {
                try {
                    const user = this.users[userIndex];
                    const recipient = user.recipients[recipientIndex];
                    if(confirm('確定要刪除此收件人資料？')) {
                        await ApiService.recipientAPI.deleteRecipient(recipient.id);
                        user.recipients.splice(recipientIndex, 1);
                    }
                } catch(error) {
                    handleApiError(error, '刪除收件人失敗');
                }
            },
            openCreateUserModal(){
                this.isEditing = false;
                this.userForm = { 
                    name:'',
                    email:'',
                    password:'',
                    confirmPassword:'',
                    role:'user',
                    phone:'',
                    address:''
                };
                this.$nextTick(()=>{
                    const modal = new bootstrap.Modal(this.$refs.userModal);
                    modal.show();
                })
            },
            openEditUserModal(index){
                this.isEditing = true;
                this.currentIndex = index;
                this.userForm = {...this.users[index]};
                this.userForm.password='';
                this.userForm.confirmPassword = '';

                const modal = new bootstrap.Modal(this.$refs.userModal);

                modal.show();
            },
            async saveUser(){
                try{
                    if(this.userForm.password !== this.userForm.confirmPassword){
                            alert('密碼和確認密碼不一致');
                            return;
                        }

                    if(this.isEditing){
                        const userData ={
                            name: this.userForm.name,
                            email: this.userForm.email,
                            role: this.userForm.role,
                            phone: this.userForm.phone,
                            address: this.userForm.address,
                        };
                        if(this.userForm.password){
                            userData.password = this.userForm.password;
                        }
                        await ApiService.userAPI.updateUser(this.userForm.id,userData);
                        this.users[this.currentIndex] = {...this.userForm};//更新用戶資料
                    }else{
                        const userData = {
                            name: this.userForm.name,
                            email: this.userForm.email,
                            role: this.userForm.role,
                            phone: this.userForm.phone,
                            address: this.userForm.address,
                            password: this.userForm.password,
                        };
                        const response = await ApiService.userAPI.createUsers(userData);
                        this.users.push(response.data);//新增用戶
                    }          
                this.closeModal();
                }catch(error){
                    console.error('更新用戶資料時錯誤！',error);
                    alert('更新用戶資料失敗！')
                }
            },
            async deleteUser(index){
                if(confirm('確定要刪除此用戶嗎？')){
                    try{
                        await ApiService.userAPI.deleteUsers(this.users[index].id);
                        this.users.splice(index, 1);
                    }catch(error){
                        ('刪除用戶失敗',error);
                        alert('無法刪除用戶');
                    }
                }
            },
            closeModal(){
                this.$nextTick(()=>{
                    const modalInstance = bootstrap.Modal.getInstance(this.$refs.userModal);
                    if(modalInstance){
                        modalInstance.hide(); 
                    }
                    
                })

            },
            getUserInitials(name) {
                return name ? name.substring(0, 2).toUpperCase() : '??';
            },

            getRoleBadgeClass(role) {
                return role === 'admin' ? 'badge bg-primary' : 'badge bg-success';
            },

            getRoleDisplayName(role) {
                return role === 'admin' ? '管理員' : '一般用戶';
            },

            toggleRecipients(index) {
                if(!this.users[index]) return;

                // 檢查是否有收件人資料
                const currentUser = this.users[index];
                if(!currentUser.recipients?.length){
                    alert('此用戶沒有收件人資料');
                    return;
                }
                // 關閉其他展開面板
                this.users.forEach((u, idx) => {
                    if(idx !== index){
                        u.showRecipients = false;
                    }
                });
                currentUser.showRecipients = !currentUser.showRecipients;
            },
            addRecipient(userIndex) {
                const userId = this.users[userIndex].id;
                this.isEditingRecipient = false;
                this.editRecipient = {
                    name: '',
                    phone: '',
                    address: '',
                    user_id: userId
                };
                this.showRecipientModal();
            },
            editRecipientInfo(userIndex, recipientIndex) {
                this.isEditingRecipient = true;
                this.editingRecipientIndex = recipientIndex;
                const recipient = this.users[userIndex].recipients[recipientIndex];
                this.editRecipient = { ...recipient };
                this.showRecipientModal();
            },
            async saveRecipient() {
            if (!this.isRecipientValid(this.editRecipient)) {
                alert('請檢查收件人資料是否完整且格式正確！');
                return;
            }
            try {
                let response;
                if (this.isEditingRecipient) {
                    response = await ApiService.recipientAPI.updateRecipient(
                        this.editRecipient.id,
                        this.editRecipient
                    );
                } else {
                    response = await ApiService.recipientAPI.addRecipient(this.editRecipient);
                }
                

                const modalElement = this.$refs.recipientModal;
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                await this.loadUsers(); // 重新載入用戶資料
                alert(this.isEditingRecipient ? '收件人資料已更新' : '新增收件人成功');
            } catch (error) {
                    handleApiError(error, this.isEditingRecipient ? '更新收件人失敗' : '新增收件人失敗');
                }
            },
            isRecipientValid(recipient) {
                const phoneRegex = /^[0-9]{10}$/;
                return recipient.name.trim() && phoneRegex.test(recipient.phone) && recipient.address.trim();
            },
            showRecipientModal() {
                const modal = new bootstrap.Modal(this.$refs.recipientModal);
                modal.show();
            },
            closeRecipientModal() {
                const modalInstance = bootstrap.Modal.getInstance(this.$refs.recipientModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        
    }
};
</script>

<style scoped>
.user-avatar {
    width: 40px;
    height: 40px;
    background-color: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #6c757d;
}

.recipient-panel {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
}

.recipient-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #f8f9fa;
}

.recipient-item {
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: all 0.2s ease;

}

.recipient-item:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
}

.recipient-info {
    width: 100%;
}

.recipient-actions {
    display: flex;
    gap: 0.5rem;
}

/* 動畫效果 */
.recipient-list-enter-active,
.recipient-list-leave-active {
    transition: all 0.3s ease;
}

.recipient-list-enter-from,
.recipient-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* 響應式設計 */
@media (max-width: 768px) {
    .recipient-item {
        padding: 0.75rem;
    }
    
    .recipient-actions {
        margin-top: 0.5rem;
        justify-content: flex-end;
    }
}

.badge {
    padding: 0.5em 0.75em;
    font-weight: 500;
}

.modal-content {
    border: none;
    border-radius: 1rem;
}

.form-control, .form-select {
    padding: 0.75rem 1rem;
}

.address-section {
    position: relative;
}

.address-panel {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 300px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 0.5rem;
}

.address-item {
    background-color: #f8f9fa;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.address-item:hover {
    background-color: #e9ecef;
}

td.address-section {
    overflow: visible;
}
</style>
