<template>
    <div class="homeDiv" v-if="showHome">
        <Stars></Stars>
        <div class="homeParent">
            <div id="background" class="homeBackground">
                <StarBackground></StarBackground>
            </div>
            <div class="homeHeaderDiv">
                <n-button v-if="!isLogged" class="loginButton" type="primary" @click="$router.push('/login');"
                    href="/">登录</n-button>
                <n-button v-if="isLogged" class="loginButton" type="primary" @click="logout" href="/">退出登录</n-button>
            </div>
            <div class="homeContentDiv">
                <div class="homeContentLeft">
                    <!-- <Clock></Clock> -->
                    <img src="@/assets/AcadVista-长款.png" width="400" style="z-index: 1;" />
                    <div class="infos">
                        <div class="infosTop">
                            <div class="info">
                                <n-icon colar="white" :size="iconSize">
                                    <PeopleQueue24Filled />
                                </n-icon>
                                <span>
                                    <span>学者</span>
                                    <n-number-animation :from="0" :to="12100566" :duration="1000" />
                                </span>
                            </div>
                            <div class="info">
                                <n-icon colar="white" :size="iconSize">
                                    <BuildingSkyscraper20Filled />
                                </n-icon>
                                <span>
                                    <span>机构</span>
                                    <n-number-animation :from="0" :to="20182" :duration="1000" />
                                </span>
                            </div>
                        </div>
                        <div class="infosBottom">
                            <div class="info">
                                <n-icon colar="white" :size="iconSize">
                                    <DocumentBulletList24Filled />
                                </n-icon>
                                <span>
                                    <span>论文</span>
                                    <n-number-animation :from="0" :to="11036659" :duration="1000" />
                                </span>
                            </div>
                            <div class="info">
                                <n-icon colar="white" :size="iconSize">
                                    <ChartMultiple24Filled />
                                </n-icon>
                                <span>
                                    <span>领域</span>
                                    <n-number-animation :from="0" :to="78963" :duration="1000" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="homeContentRight">
                    <div class="search">
                        <div class="searchDiv" :class="{ searchRotate: changeCard }">
                            <n-popover :show="showComplete" placement="bottom" trigger="manual" :show-arrow="false" raw>
                                <template #trigger>
                                    <n-input ref="searchInput" class="searchInput" type="text" placeholder="" size="large"
                                        v-model:value="searchValue" @focus="searchComplete" @blur="showComplete = false"
                                        @keyup.enter.naive="search(searchValue)" @keydown.up.naive.prevent="key_up"
                                        @keydown.down.naive="key_down" @input="searchComplete">
                                        <template #prefix>
                                            <div class="advancedSearch"></div>
                                        </template>
                                        <template #suffix>
                                            <div class="selectPlaceHolder"></div>
                                            <n-icon style="cursor: pointer;" size="28" color="var(--primary-100)"
                                                :component="Search12Filled" @click="search(searchValue)" />
                                        </template>
                                    </n-input>
                                </template>
                                <div class="completeSearch">
                                    <div v-for="(completeSearchOption, index) in completeSearchOptions" :key="index"
                                        @click="search(completeSearchOption.label)" class="completeSearchOption"
                                        :class="{ completeSearchOptionIsSelect: completeSearchOption.isSelect }">
                                        {{ completeSearchOption.label }}
                                    </div>
                                </div>
                            </n-popover>
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
        <n-scrollbar style="max-height: calc(100vh - 57px)">
            <div class="main">
                <router-view></router-view>
            </div>
        </n-scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, onMounted, Ref } from 'vue';
import Header from '@/components/Home/Header.vue'
import Menu from '@/components/Home/Menu.vue'
import StarBackground from '@/components/Login/StarBackground.vue';
// import Clock from '@/components/Clock.vue';
import { useRoute } from 'vue-router'
import AdvancedSearch from '@/components/search/AdvancedSearch.vue';
import Stars from '@/components/Home/Stars.vue'
import { Search12Filled, PeopleQueue24Filled, BuildingSkyscraper20Filled, DocumentBulletList24Filled, ChartMultiple24Filled } from "@vicons/fluent";
import router from '@/router';
import { useMessage } from 'naive-ui';
import { post } from '@/api/axios';

const route = useRoute()
const iconSize = ref(80)
const isLogged = ref(false)
const message = useMessage()

import { useAxiosStore } from '@/store/axiosStore';
const axiosStore = useAxiosStore()
const logout = () => {
    isLogged.value = false;
    localStorage.removeItem('uid')
    axiosStore.removeAuthorizationHeader()
}

// 判断是否需要展示首页
const showHome = ref(true)
watch(() => route.path, (newValue) => {
    showHome.value = (newValue == '/')
})
onMounted(() => {
    showHome.value = (route.path == '/')
    if (localStorage.getItem('uid') !== null) {
        isLogged.value = true
    } else {
        isLogged.value = false
    }
})

//搜索推荐的地方
const searchValue = ref("")
const showComplete = ref(false)
const currentCompleteSearchOptionIndex = ref(-1)
const copySearchValue = ref("")
const completeSearchOptions: Ref<{ label: string, isSelect: boolean }[]> = ref([]);
const searchInput: Ref<any> = ref(null)
let time: any;
const searchComplete = async () => {
    copySearchValue.value = searchValue.value;
    let res = null;
    if (!searchValue.value) {
        showComplete.value = false;
        return
    }
    if (time) {
        clearTimeout(time);
    }
    time = setTimeout(async () => {
        res = await post(message,'/paper/suggest',{
            query:searchValue.value
        })
        if(!res || res.length == 0){
            showComplete.value = false;
        }else{
            completeSearchOptions.value = res.map((suffix:string) => {
                return {
                    label: suffix,
                    isSelect: false
                }
            })
            showComplete.value = true;
        }
    }, 200)
    currentCompleteSearchOptionIndex.value = -1;
}
const key_up = () => {
    if (currentCompleteSearchOptionIndex.value != -1)
        completeSearchOptions.value[currentCompleteSearchOptionIndex.value].isSelect = false
    currentCompleteSearchOptionIndex.value--;
    if (currentCompleteSearchOptionIndex.value == -1) {
        searchValue.value = copySearchValue.value;
    } else if (currentCompleteSearchOptionIndex.value == -2) {
        currentCompleteSearchOptionIndex.value = completeSearchOptions.value.length - 1;
        completeSearchOptions.value[currentCompleteSearchOptionIndex.value].isSelect = true;
        searchValue.value = completeSearchOptions.value[currentCompleteSearchOptionIndex.value].label;
    } else {
        completeSearchOptions.value[currentCompleteSearchOptionIndex.value].isSelect = true;
        searchValue.value = completeSearchOptions.value[currentCompleteSearchOptionIndex.value].label;
    }
    searchInput.value.setSelectionRange(searchValue.value.length, searchValue.value.length);
}
const key_down = () => {
    if (currentCompleteSearchOptionIndex.value != -1)
        completeSearchOptions.value[currentCompleteSearchOptionIndex.value].isSelect = false;
    currentCompleteSearchOptionIndex.value++;
    if (currentCompleteSearchOptionIndex.value == completeSearchOptions.value.length) {
        currentCompleteSearchOptionIndex.value = -1;
        searchValue.value = copySearchValue.value;
    } else {
        completeSearchOptions.value[currentCompleteSearchOptionIndex.value].isSelect = true;
        searchValue.value = completeSearchOptions.value[currentCompleteSearchOptionIndex.value].label;
    }
    searchInput.value.setSelectionRange(searchValue.value.length, searchValue.value.length);
}
const search = async (value: string) => {
    if (value.length === 0) {
        return
    }
    router.push({
        path: '/search',
        query: {
            keyword: value,
        }
    })
}

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
    color: var(--bg-100);
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
    background-color: var(--bg-100);
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 10px #ccc, 0 -5px 10px #ccc;
    z-index: 999;
    view-transition-name: mainHeader;
}

.menu {
    height: 100vh;
    background-color: var(--bg-100);
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
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .infos {
        z-index: 1;
        display: flex;
        flex-direction: column;

        width: 60%;

        .infosTop {
            display: flex;
        }


        .infosBottom {
            display: flex;
            margin-top: 10px;
        }

        .info {
            display: flex;
            width: 50%;

            span {
                margin-left: 5%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: large;
            }
        }
    }
}

.homeContentRight {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.searchInput {
    width: 80%;
    border-radius: 10px;
    position: relative;
}

.completeSearch {
    width: calc(100vw * 0.7 * 0.7 * 0.8 * 0.8);
    padding: 5px 10px;
    border-radius: 7px;
    background-color: var(--bg-100);
}

.searchIcon {
    color: var(--primary-100);
}

.searchInput :deep(.n-input__input) {
    height: 50px;
    margin-left: 22%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search {
    width: 80%;
    height: 50%;
    position: relative;
    transform-style: preserve-3d;
    perspective: 700px;
}

.completeSearchOption {
    border-radius: 5px;
    padding: 5px 7px;
    margin-top: 5px;
    cursor: pointer;
    transition: 200ms all linear;

    &:first-child {
        margin-top: 0;
    }

    &:hover {
        background-color: #ccc;
        transition: 200ms all linear;
    }
}

.completeSearchOptionIsSelect {
    background-color: #ccc;
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
    height: 50px;
    border-radius: 10% 0 0 10%;
    background-color: #757de8;
    color: white;
    font-size: 16px;
}


.searchDivider {
    position: absolute;
    left: 25%;
}

.searchButton {}

.advancedSearchDiv {
    width: 100%;
    height: 150%;
    background-color: var(--bg-100);
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
