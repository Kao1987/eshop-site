<!-- frontend/admin/adminUsers.vue -->
<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">用戶管理</h2>
        <!-- 新增用戶 -->
        <div class="admin-users container mt-5">
            <button class="btn btn-success" @click="openCreateUserModal">新增用戶</button>
        </div>
        <!-- 用戶列表 -->
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>用戶名</th>
                    <th>電子信箱</th>
                    <th>權限</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                    <template v-for="(user,index) in users" :key="index">
                        <tr>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.role }}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" @click="openEditUserModal(index)">編輯</button>
                                <button class="btn btn-danger btn-sm ml-2" @click="deleteUser(index)">刪除</button>
                            </td>
                        </tr>
                        <tr v-if="user.recipients && Array.isArray(user.recipients)">
                            <td colspan="4">
                                <div class="recipient-card">
                                    <div v-for="(recipient,recipientIndex) in user.recipients" :key="recipientIndex">
                                        <strong>收件人名稱:</strong> {{ recipient.name }}
                                    <strong>電話:</strong> {{ recipient.phone }}
                                    <strong>地址:</strong> {{ recipient.address }}
                                    <button class="btn btn-sm btn-warning" @click="editRecipient(index, recipientIndex)">編輯收件人</button>
                                    <button class="btn btn-sm btn-danger" @click="deleteRecipient(index, recipientIndex)">刪除</button>
                                    <br/>
                                    </div>
                                </div>
                            </td>
                    </tr>
                    </template>

            </tbody>
        </table>
        <!-- 新增/編輯用戶 MODAL -->
        <div class="modal fade" tabindex="-1" ref="userModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? '編輯用戶':'新增用戶'}}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveUser">
                            <div class="mb-3">
                                <label for="userName" class="form-label">用戶名</label>
                                <input type="text" class="form-control" id="userName" v-model="userForm.name" required/>
                            </div>
                            <div class="mb-3">
                                <label for="userEmail" class="form-label">電子郵件</label>
                                <input type="email" class="form-control" id="userEmail" v-model="userForm.email" required/>
                            </div>
                            <div class="mb-3">
                                <label for="userPassword" class="form-label">密碼</label>
                                <input
                                type="password"
                                class="form-control"
                                id="userPassword"
                                v-model="userForm.password"
                                :required="!isEditing || userForm.password"
                                >
                            </div>                            
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">確認密碼</label>
                                <input
                                type="password"
                                class="form-control"
                                id="confirmPassword"
                                v-model="userForm.confirmPassword"
                                :required="!isEditing || userForm.password"
                                >
                            </div>
                            <div class="mb-3">
                                <label for="userName" class="form-label">權限</label>
                                <select id="userRole" class="form-select" v-model="userForm.role">
                                    <option value="user">用戶</option>
                                    <option value="admin">管理者</option>
                                </select>
                            </div>
                            <!-- 編輯用戶詳細資料 -->
                            <div v-if="userForm.role === 'user'">
                                <div class="mb-3">
                                    <label for="userPhone" class="form-label">電話</label>
                                    <input type="text" class="form-control" id="userPhone" v-model="userForm.phone" :required="userForm.role === 'user'" />
                                </div>
                                <div>
                                    <label for="userAddress" class="form-label">地址</label>
                                    <input type="text" class="form-control" id="userAddress" v-model="userForm.address" :required="userForm.role === 'user'" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                                <button type="submit" class="btn btn-primary">{{ isEditing ? '保存變更' : '新增用戶' }}</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import * as bootstrap from 'bootstrap';


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
            };
        },
        mounted(){
            this.loadUsers();
        },
        // 開啟新增用戶的視窗
        methods:{
            async loadUsers(){
                try{
                    const response = await axios.get('/api/users');
                    this.users = response.data;
                }catch(error){
                    console.error('加載用戶資料失敗',error);
                    alert('無法家載用戶資料');
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
                        await axios.put(`/api/users/${this.userForm.id}`,userData);
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
                        const response = await axios.post('/api/users',userData);
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
                        await axios.delete(`/api/users/${this.users[index].id}`);
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
        },

        
};
</script>
<style scoped>
.admin-users{
    max-width:800px;
    margin:0 auto;
}
</style>