<!-- frontend/src/views/UserLogin.vue -->
<template>
    <div class="login-page">
        <div class="login-container container">
            <div class="auth-card">
                <div class="auth-header text-center mb-4">
                    <h2 class="fw-bold text-primary">會員登入</h2>
                    <p class="text-muted">歡迎回來，請登入您的帳號</p>
                </div>
                
                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="form-floating mb-3">
                        <input 
                            type="email" 
                            id="email" 
                            v-model="email" 
                            class="form-control" 
                            placeholder="請輸入電子郵件"
                            required
                        >
                        <label for="email">電子郵件</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input 
                            :type="showPassword ? 'text' : 'password'"
                            id="password" 
                            v-model="password" 
                            class="form-control" 
                            placeholder="請輸入密碼"
                            required
                        >
                        <label for="password">密碼</label>
                        <button 
                            type="button"
                            class="btn btn-link password-toggle"
                            @click="showPassword = !showPassword"
                        >
                            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="remember">
                            <label class="form-check-label" for="remember">記住我</label>
                        </div>
                        <router-link to="/ForgotPwd" class="text-primary text-decoration-none">
                            忘記密碼？
                        </router-link>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 mb-3">
                        <i class="fas fa-sign-in-alt me-2"></i>登入
                    </button>

                    <div class="text-center">
                        <p class="mb-0">還沒有帳號？ 
                            <router-link to="/UserRegister" class="text-primary text-decoration-none">
                                立即註冊
                            </router-link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    padding: 2rem 0;
}

.login-container {
    max-width: 400px;
    width: 100%;
}

.auth-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.auth-header h2 {
    color: #2c3e50;
}

.form-floating {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6c757d;
    padding: 0;
}

.password-toggle:hover {
    color: #0d6efd;
}

.btn-primary {
    padding: 0.75rem;
    font-weight: 500;
    transition: all 0.2s;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.5rem rgba(13, 110, 253, 0.2);
}

@media (max-width: 576px) {
    .login-container {
        padding: 0 1rem;
    }
    
    .auth-card {
        padding: 1.5rem;
    }
}
</style>
    
<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { mapActions } from 'vuex';

    export default {
        name: 'UserLogin',
        data(){
            return{
                email:'',
                password:'',
                showPassword: false
            };
        },
        methods:{
            ...mapActions('auth',['login']),
            async handleLogin(){
                try {
                    const response = await this.login({
                        email:this.email.trim().toLowerCase(),
                        password:this.password
                    });
                    if(!response || !response.data){
                        throw new Error('無法取得用戶資料或 token');
                    }
                    const user = response.data;    
                    if(!user){
                        throw new Error('無法取得用戶資料');
                    }
                    console.log("找到的用戶",user);
                    alert('登入成功!歡迎' + user.name);
                    
                    const redirectPath = this.$route.query.redirect || '';
                    if (user.role.toLowerCase() === 'admin') {
                        this.$router.push(typeof redirectPath === 'string' && redirectPath.startsWith('/admin') ? redirectPath : '/admin');
                    } else {
                        this.$router.push(typeof redirectPath === 'string' && !redirectPath.startsWith('/admin') ? redirectPath : '/MembersPage');
                    }
                }catch (error){
                    handleApiError(error,'登入失敗，請稍後再試');
                }
            }
        }
    }
</script>