<template>
    <div class="footer d-flex flex-column">
        <div class="flex-grow-1">
        <p>台灣ECshop.com有限公司<br/>
            統編 99999999<br/>
            Copyright 2024, ECSHOP Group.</p>
    </div>
    </div>


</template>
    
    <script>
    export default {
        name: 'MainFooter',
    };
    </script>
    
<style scoped>
.footer{
    bottom: 0;
    width: 100%;
    left: 0;
    background-attachment: fixed;
    background-image: url('../assets/img/header_bg.jpg'); /* 使用相對路徑引用背景圖片 */
    color:aqua;
    text-align: center;
}
.flex-grow-1{
    flex-grow: 1;
}
body {
    padding-bottom: 50px;
}
</style>
    