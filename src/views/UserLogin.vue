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

    export default {
        name: 'UserLogin',
        data(){
            return{
                email:'',
                password:''
            };
        },
        methods:{
            async handleLogin(){
                try {
                    const response = await axios.get("api/users",{
                        params:{
                                email:this.email,
                                password:this.password
                            }
                        }
                    );
                    const users = response.data;
                    console.log("用戶資料:",users);

                    if(users.length > 0){
                        const user = users[0];
                        console.log("找到的用戶",user);
                        alert('登入成功!歡迎' + user.name);

                        //登入邏輯
                        if (user.role === 'admin') {
                            localStorage.setItem('authToken', 'adminToken');
                            localStorage.setItem('role', 'admin');
                            localStorage.setItem('userID', user.id);  // 登入成功後將用戶 ID 存入 localStorage
                            alert('登入成功，即將跳轉到管理頁面');
                            this.$nextTick(()=>{
                                this.$router.push('/admin'); // 管理員跳轉到控制台
                            });
                        } else if ( user.role === 'user') {
                            localStorage.setItem('authToken', 'userToken');
                            localStorage.setItem('role', 'user');
                            localStorage.setItem('userID', user.id);  // 登入成功後將用戶 ID 存入 localStorage
                            alert('登入成功，即將跳轉到會員頁面');
                            this.$nextTick(()=>{
                                this.$router.push('/MembersPage');// 普通用戶跳轉到用戶中心
                            });
                        } else {
                            alert('帳號或密碼錯誤');
                        }
                    }
                }catch (error){
                    console.error("登入失敗",error);
                    alert("登入失敗，請稍候再試");
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
    