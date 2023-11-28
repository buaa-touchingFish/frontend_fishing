<template>
    <div class="homeDiv" v-if="showHome">
        <div class="homeHeaderDiv">
            <n-button class="loginButton" @click="$router.push('/scholarHome');" href="/">设置</n-button>
            <n-button class="loginButton" @click="$router.push('/login');" href="/">登录</n-button>
        </div>
        <div class="homeContentDiv">
            <div class="homeContentLeft">
                <n-h1 class="slogen">学海无涯苦作舟</n-h1>
                <div class="searchDiv">
                    <n-auto-complete class="searchBar" clear-after-select size="large" placeholder="搜索你想了解的论文"
                        :options="searchOptions" />
                    <n-button class="searchButton" @click="$router.push('/search')">搜</n-button>
                </div>
                <!--
                    <n-auto-complete class="autocmp" clear-after-select @select="searchSelected"
                                v-model:value="searchValue" :options="searchOptions" placeholder="搜索聊天历史记录"
                                :render-label="renderSearchLabel" size="large" />
                -->
            </div>
        </div>
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
import { ref, watch, onMounted, computed } from 'vue';
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断是否需要展示首页
const showHome = ref(true)
watch(() => route.path, (newValue) => {
    showHome.value = (newValue == '/')
})
onMounted(() => {
    showHome.value = (route.path == '/')
})

//搜索推荐的地方
const searchOptions = computed(() => {
    const result: string[] = [];
    result.push("我落泪");
    result.push("情绪零碎");
    return result;
});
</script>

<style scoped>
.mainContainer {
    width: 100%;
}

.header {
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

.main {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.homeDiv {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.homeHeaderDiv {
    width: 100vw;
    height: 60px;
    background-color: #fcc;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}

.loginButton {
    margin-right: 20px;
}

.homeContentDiv {
    width: 100vw;
    height: 400px;
    flex-direction: row;
    align-items: center;
}

.homeContentLeft {
    width: 65%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: aliceblue;
    justify-content: center;
}

.slogen {
    margin-left: 40px;
    font-size: 40pt;
}

.searchBar {
    width: 100%;
}

.searchBar :deep(.n-input) {
    --n-border: 'none' !important;
    --n-border-hover: 'none' !important;
    --n-border-focus: 'none' !important;
    --n-box-shadow-focus: 'none' !important;
}

.searchBar :deep(.n-input__input) {
    margin-right: 40px;
}

.searchDiv {
    width: 90%;
    height: 40px;
    display: flex;
    background-color: #fcc;
    align-self: center;
    position: relative;
}

.searchButton {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;

}
</style>
