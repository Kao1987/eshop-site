<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">管理後台儀表板</h2>
        <div class="row">
            <div class="col-md-4">
                <router-link to="/admin/products" class="btn btn-primary btn-block">商品管理</router-link>
            </div>
            <div class="col-md-4">
                <router-link to="/admin/orders" class="btn btn-primary btn-block">訂單管理</router-link>
            </div>
            <div class="col-md-4">
                <router-link to="/admin/users" class="btn btn-primary btn-block">使用者管理</router-link>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'AdminDashboard',
};
</script>
<style scope>
.admin-dashboard{
    max-width: 800px;
    margin:0 auto;
}

</style>