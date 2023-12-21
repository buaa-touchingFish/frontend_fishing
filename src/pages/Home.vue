<template>
    <div class="homeDiv" v-if="showHome">
        <Stars></Stars>
        <div class="homeParent">
            <div id="background" class="homeBackground">
                <StarBackground></StarBackground>
            </div>
            <div class="homeHeaderDiv">
                <n-button class="loginButton" @click="$router.push({
                    path: '/scholarHome',
                    query: {
                        author_name: 'J. Russell Ramsay',
                        author_id: 'A5077915689'
                    }
                });" href="/">设置</n-button>
                <n-button class="loginButton" @click="$router.push('/login');" href="/">登录</n-button>
            </div>
            <div class="homeContentDiv">
                <div class="homeContentLeft">
                    <Clock></Clock>
                </div>
                <div class="homeContentRight">
                    <div class="search">
                        <div class="searchDiv" :class="{ searchRotate: changeCard }">
                            <n-auto-complete class="searchBar" size="large" placeholder="搜索你想了解的论文"
                                :options="searchOptions" />
                            <n-button class="searchButton" @click="$router.push('/search')" type="primary">搜索</n-button>
                            <n-button class="extraButton" @click="changeShowCard" type="primary">高级搜索</n-button>
                        </div>
                        <div class="advancedSearchDiv" :class="{ advancedSearchRotate: changeCard }">
                            <n-button class="backButton" @click="changeShowCard">返回</n-button>
                            <AdvancedSearch></AdvancedSearch>
                        </div>
                    </div>
                </div>
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
import { ref, watch, onMounted, computed, Ref } from 'vue';
import Header from '@/components/Home/Header.vue'
import Menu from '@/components/Home/Menu.vue'
import StarBackground from '@/components/Login/StarBackground.vue';
import Clock from '@/components/Clock.vue';
import { useRoute } from 'vue-router'
import AdvancedSearch from '@/components/search/AdvancedSearch.vue';
import Stars from '@/components/Home/Stars.vue'
import { Search12Regular, Earth16Regular } from "@vicons/fluent";

const route = useRoute()

// 判断是否需要展示首页
const showHome = ref(true)
watch(() => route.path, (newValue) => {
    showHome.value = (newValue == '/')
})
onMounted(() => {
    showHome.value = (route.path == '/')
})

const searchValue = ref("")

//搜索推荐的地方
const searchOptions = computed(() => {
    const result: string[] = [];
    result.push("我落泪");
    result.push("情绪零碎");
    return result;
});

// Card
const changeCard = ref(false)
const changeShowCard = () => {
    changeCard.value = !changeCard.value
}
</script>

<style scoped>
.homeParent {
    position: relative;
    width: 100%;
    height: 100%;
    color: white;
}

.homeBackground {
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 0;
}

.mainContainer {
    width: 100%;
    min-height: 100vh;
    height: fit-content;
    background-color: var(--bg-rendering);
}

.header {
    height: 57px;
    width: 100%;
    background-color: white;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 10px #ccc, 0 -5px 10px #ccc;
    z-index: 999;
}

.menu {
    height: 100vh;
    background-color: transparent;
    position: fixed;
    z-index: 998;
}

.main {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.homeDiv {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-image: url('../assets/sky.jpg'); */
    background-color: aliceblue;
}

.homeHeaderDiv {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

}

.loginButton {
    margin-right: 20px;
}

.homeContentDiv {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
}

.homeContentLeft {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.homeContentRight {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.slogen {
    margin-left: 40%;
    font-size: 40pt;
    width: 30%;
}

.searchIcon {
    position: absolute;
    left: 0;
    top: 18%;
    box-shadow: 0 0 20px 10px white;
    border-radius: 50%;
    animation: shining 2.5s linear infinite;
}

.searchInputLeft {
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.searchBar {
    width: 90%;
}

.searchBar :deep(.n-input) {
    --n-border: 'none' !important;
    --n-border-hover: 'none' !important;
    --n-border-focus: 'none' !important;
    --n-box-shadow-focus: 'none' !important;
}

.searchBar :deep(.n-input__input) {
    height: 50px;
    margin-left: 10px;
    padding-top: 5px;
}

.search {
    width: 80%;
    height: 50%;
    position: relative;
    transform-style: preserve-3d;
    perspective: 700px;
}

.searchDiv {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    backface-visibility: hidden;
    transition: 1s;
}

.extraButton {
    position: absolute;
    left: 10%;
    height: 15%;
    border-radius: 15% 0 0 15%;
    background-color: white;
    color: #000;
}

.extraButton:hover {
    position: absolute;
    left: 10%;
    height: 15%;
    border-radius: 15% 0 0 15%;
    background-color: white;
    color: #000;
    border-color: #000;
}

.searchDivider {
    position: absolute;
    left: 25%;
}

.searchButton {}

.advancedSearchDiv {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transform: rotateY(180deg);
    transition: 1s;
    backface-visibility: hidden;
    box-shadow: 0 0 20px 10px white;

    animation: shining 2.5s linear infinite;
}

@keyframes shining {
    0% {
        box-shadow: 0 0 20px 10px white;
    }

    50% {
        box-shadow: 0 0 10px 0px white;
    }

    100% {
        box-shadow: 0 0 20px 10px white;
    }
}

.searchRotate {
    transform: rotateY(-180deg);
    transition: 1s;
}

.advancedSearchRotate {
    transform: rotateY(0deg);
    transition: 1s;
}

.backButton {
    position: absolute;
    right: 0;
    top: 0;
}


.homeContentBottom {
    display: flex;
    flex-direction: row;
}
</style>
