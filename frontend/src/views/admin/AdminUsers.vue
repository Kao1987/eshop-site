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
                                <td>
                                    <button 
                                        class="btn btn-link btn-sm text-decoration-none"
                                        @click="toggleRecipients(index)"
                                        v-if="user.recipients && user.recipients.length"
                                    >
                                        {{ user.recipients.length }} 個地址
                                        <i :class="['fas', user.showRecipients ? 'fa-chevron-up' : 'fa-chevron-down', 'ms-1']"></i>
                                    </button>
                                    <span v-else class="text-muted">無收件地址</span>
                                </td>
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
                            <tr v-if="user.showRecipients && user.recipients && user.recipients.length">
                                <td colspan="4" class="bg-light">
                                    <div class="recipient-list p-3">
                                        <div v-for="(recipient, recipientIndex) in user.recipients" 
                                             :key="recipientIndex"
                                             class="recipient-item"
                                        >
                                            <div class="recipient-info">
                                                <h6 class="mb-2">{{ recipient.name }}</h6>
                                                <p class="mb-1">
                                                    <i class="fas fa-phone me-2 text-muted"></i>
                                                    {{ recipient.phone }}
                                                </p>
                                                <p class="mb-0">
                                                    <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                                                    {{ recipient.address }}
                                                </p>
                                            </div>
                                            <div class="recipient-actions">
                                                <button 
                                                    class="btn btn-outline-primary btn-sm me-2"
                                                    @click="editRecipient(index, recipientIndex)"
                                                >
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    class="btn btn-outline-danger btn-sm"
                                                    @click="deleteRecipient(index, recipientIndex)"
                                                >
                                                    <i class="fas fa-trash"></i>
                                                </button>
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
    </div>
</template>

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

.recipient-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.recipient-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.recipient-info {
    flex: 1;
}

.recipient-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-group .btn {
    padding: 0.375rem 0.75rem;
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

@media (max-width: 768px) {
    .recipient-item {
        flex-direction: column;
        gap: 1rem;
    }

    .recipient-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>

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
            };
        },
        mounted(){
            this.loadUsers();
        },
        // 開啟新增用戶的視窗
        methods:{
            async loadUsers(){
                try{
                    const response = await ApiService.userAPI.getAllUsers();
                    this.users = response.data;
                }catch(error){
                    handleApiError(error, '無法加載用戶資料');
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
                this.$set(this.users[index], 'showRecipients', !this.users[index].showRecipients);
            }
        },

        
};
</script>