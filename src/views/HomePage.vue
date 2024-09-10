<template>
    <div class="home">
        <p>HOME</p>
    </div>


</template>

<script>
export default {
    name: 'HomePage',
    data() {
    return {
        searchQuery: '',
        searchResult: null,
    };
    },
    methods: {
    handleSearch() {
        this.searchResult = `你正在搜尋：${this.searchQuery}`;
    },
    },
}
</script>

<style scoped>
/* 同樣的樣式，保留在這裡 */
</style>
