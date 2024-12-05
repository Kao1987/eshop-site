<template>
    <div>
    <h1>搜尋結果</h1>
    <p>搜尋關鍵字：{{ searchQuery }}</p>
    <!-- 這裡可以顯示搜尋的結果 -->
    </div>
</template>

<script>
export default {
    name: 'SearchResults',
    computed: {
        searchQuery() {
        return this.$route.query.q || '未指定';  // 預設顯示 "未指定"
    }
    },
    
};
</script>
