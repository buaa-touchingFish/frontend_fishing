<template>
    <div class="home" v-if="showHome">
        this is home page.
        <n-button @click="$router.push('/search')">去搜索页</n-button>
    </div>
    <div class="mainContainer" v-else>
        <div class="header">
            <Header></Header>
        </div>
        <div class="menu">
            <Menu></Menu>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref,watch,onMounted } from 'vue';
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断是否需要展示首页
const showHome = ref(true)
watch(() => route.path,(newValue) => {
    showHome.value = (newValue == '/')
})
onMounted(() => {
    showHome.value = (route.path == '/')
})
</script>

<style scoped>
.mainContainer{
    width: 100%;
}
.header{
    height: 57px;
    width: 100%;
    background-color: red;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.menu {
    width: 30px;
    height: 100%;
    background-color: blue;
    position: fixed;
}
.main{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
