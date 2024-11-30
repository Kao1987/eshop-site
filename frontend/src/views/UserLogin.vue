<!-- frontend/src/views/UserLogin.vue -->
<template>
    <div class="login-container container mt-5">
        <h2 class="text-center mb-4">會員登入</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label for="email" class="form-label">帳號/電子郵件</label>
                <input type="email" id="email" v-model="email" name="email" class="form-control" placeholder="請輸入你的EMAIL" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" id="password" v-model="password" name="password" class="form-control" placeholder="請輸入密碼" required>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <router-link class="text-decoration-none" to="/ForgotPwd">忘記密碼？</router-link>
                <router-link class="text-decoration-none" to="/UserRegister">註冊新帳號</router-link>
            </div>
            <button type="submit" class="btn btn-primary w-100">登入</button>
        </form>
    </div>

</template>
    
<script>
    import axios from 'axios';    
    import { mapActions } from 'vuex';

    export default {
        name: 'UserLogin',
        data(){
            return{
                email:'',
                password:''
            };
        },
        methods:{
            ...mapActions('auth',['login']),
            async handleLogin(){
                try {
                    const response = await axios.post("/api/users/login",{
                        email:this.email,
                        password:this.password
                    });
                    const user = response.data;
                    console.log("用戶資料:",user);
                    if(user){
                        console.log("找到的用戶",user);
                        alert('登入成功!歡迎' + user.name);
                        
                        //更新vuex狀態 
                        this.login(user);

                        const redirectPath = this.$route.query.redirect;

                        //登入邏輯
                        if (user.role === 'admin') {
                            if(redirectPath && redirectPath.startsWith('/admin')){
                                this.$router.push(redirectPath);
                            }else{
                                this.$router.push('/admin'); // 管理員跳轉到控制台
                            }
                        } else if ( user.role === 'user') {
                            if(redirectPath && !redirectPath.startsWith('/admin')){
                                this.$router.push(redirectPath);
                            }else{
                                this.$router.push('/MembersPage');// 普通用戶跳轉到用戶中心
                            }
                        } else {
                            alert('帳號或密碼錯誤');
                        }
                    }
                }catch (error){
                    if(error.response){
                        if(error.response.status === 401 || error.response.status === 404){
                            alert('帳號或密碼錯誤');
                        }else{
                            alert('登入失敗，伺服器錯誤！');
                        }
                    }else{
                    console.error("登入失敗",error);
                    alert("登入失敗，請稍候再試");
                    }
                }
            }
        }
    }
    
    </script>
    
    <style scoped>
    .login-container{
        max-width: 400px;
        width:100%;
        margin: 0 auto;
    }
    .form-control{
        max-width:400px;
        width:100%;
        justify-content: center;
    }
    .text-decoration-none{
        color: crimson;
    }
    .text-decoration-none:hover{
        text-decoration: underline;
    }


</style>
    