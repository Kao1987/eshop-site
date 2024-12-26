<template>
    <div class="register-page">
        <div class="register-container container">
            <div class="auth-card">
                <div class="auth-header text-center mb-4">
                    <h2 class="fw-bold text-primary">會員註冊</h2>
                    <p class="text-muted">創建您的帳號，開始購物之旅</p>
                </div>

                <form @submit.prevent="handleRegister" class="auth-form">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="username" 
                                    v-model="username" 
                                    placeholder="請輸入姓名"
                                    required 
                                />
                                <label for="username">會員姓名</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating">
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email" 
                                    v-model="email" 
                                    placeholder="請輸入電子信箱"
                                    required 
                                />
                                <label for="email">電子郵件</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating">
                                <input 
                                    type="tel" 
                                    class="form-control" 
                                    id="phone" 
                                    v-model="phone" 
                                    placeholder="請輸入手機號碼"
                                    required 
                                />
                                <label for="phone">手機號碼</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="address" 
                                    v-model="address" 
                                    placeholder="請輸入收件地址"
                                    required 
                                />
                                <label for="address">收件地址</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating password-wrapper">
                                <input 
                                    :type="showPassword ? 'text' : 'password'" 
                                    class="form-control" 
                                    id="password" 
                                    v-model="password" 
                                    placeholder="請設定密碼"
                                    required 
                                />
                                <label for="password">密碼</label>
                                <button 
                                    type="button"
                                    class="btn btn-link password-toggle"
                                    @click="showPassword = !showPassword"
                                >
                                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating">
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="confirmpassword" 
                                    v-model="confirmpassword" 
                                    placeholder="請再次輸入密碼"
                                    required 
                                />
                                <label for="confirmpassword">確認密碼</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="formErrors.length" class="alert alert-danger mt-3">
                        <ul class="mb-0">
                            <li v-for="error in formErrors" :key="error">{{ error }}</li>
                        </ul>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 mt-4">
                        <i class="fas fa-user-plus me-2"></i>註冊
                    </button>

                    <div class="text-center mt-3">
                        <p class="mb-0">已經有帳號？ 
                            <router-link to="/UserLogin" class="text-primary text-decoration-none">
                                立即登入
                            </router-link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';

export default {
    name: "UserRegister",
    data() {
        return {
        username: "",
        phone: "",
        address:"",
        email: "",
        password: "",
        confirmpassword: "" ,
        formErrors: [],
        showPassword: false,
        };
    },
    methods: {
        async handleRegister() {
            try{
                this.formErrors = [];

                const validationErrors = this.validateForm();
                if (validationErrors.length > 0) {
                    this.formErrors = validationErrors;
                    return;
                    }

                const response = await ApiService.userAPI.register({
                    name: this.sanitizeInput(this.username),
                    phone: this.sanitizeInput(this.phone),
                    address: this.sanitizeInput(this.address),
                    email: this.sanitizeInput(this.email.trim().toLowerCase()),
                    password: this.sanitizeInput(this.password),
                    role: "user",
                });
                if (response.success) {
                    alert("註冊成功");
                    this.$router.push("/UserLogin");
                }
            }catch (error) {
                handleApiError(error, '註冊失敗，請稍後再試');
            }
    },
        // 表單驗證方法
        validateForm() {
            const errors = [];
            
            // 用戶名驗證
            if (!this.username.trim()) {
                errors.push('請輸入會員姓名');
            } else if (this.username.length < 2) {
                errors.push('會員姓名至少需要2個字元');
            }
            // 電話驗證
            if (!this.validatePhoneNumber(this.phone)) {
                errors.push('請輸入正確的手機號碼格式（10位數字）');
            }
            // 地址驗證
            if (!this.address.trim()) {
                errors.push('請輸入地址');
            } else if (this.address.length < 8) {
                errors.push('地址需要更詳細');
            }
            // 電子郵件驗證
            if (!this.validateEmail(this.email)) {
                errors.push('請輸入正確的電子郵件格式');
            }
            // 密碼驗證
            if (!this.password) {
                errors.push('請設定密碼');
            } else if (this.password.length < 6) {
                errors.push('密碼長��需至少為6個字元');
            } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(this.password)) {
                errors.push('密碼需包含至少一個字母和一個數字');
            }
            // 確認密碼
            if (this.password !== this.confirmpassword) {
                errors.push('兩次密碼不相符');
            }
            return errors;
        },
        // 改進的電話驗證
        validatePhoneNumber(phone) {
            const phoneRegex = /^09\d{8}$/;  // 台灣手機號碼格式
            return phoneRegex.test(phone);
        },
        // 改進的電子郵件驗證
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // 改進的輸入淨化方法
        sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            return input.trim()
                    .replace(/<[^>]*>/g, '')  // 移除 HTML 標籤
                    .replace(/[<>]/g, '');    // 移除特殊字符
        }
    }
}
</script>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    padding: 2rem 0;
}

.register-container {
    max-width: 500px;
    width: 100%;
}

.auth-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.form-floating {
    position: relative;
    margin-bottom: 1rem;
}

.password-wrapper {
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
    z-index: 3;
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

.alert-danger ul {
    padding-left: 1.25rem;
}

@media (max-width: 576px) {
    .register-container {
        padding: 0 1rem;
    }
    
    .auth-card {
        padding: 1.5rem;
    }
}
</style>
