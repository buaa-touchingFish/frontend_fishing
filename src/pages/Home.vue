<template>
    <div class="homeDiv" v-if="showHome">
        <div class="homeParent">
            <div class="homeBackground">
                <!-- <StarBackground></StarBackground> -->
            </div>
            <div class="homeHeaderDiv">
                <n-button class="loginButton" @click="$router.push('/scholarHome');" href="/">设置</n-button>
                <n-button class="loginButton" @click="$router.push('/login');" href="/">登录</n-button>
            </div>
            <div class="homeContentDiv">
                <div class="homeContentLeft">
                    <Clock></Clock>
                </div>
                <div class="homeContentRight">
                    <!-- <n-h1 class="slogen">XX</n-h1> -->
                    <div class="searchDiv">
                        <n-auto-complete class="searchBar" size="large" placeholder="搜索你想了解的论文" :options="searchOptions" />
                        <n-button class="searchButton" @click="$router.push('/search')" type="primary">搜索</n-button>
                        <n-button class="extraButton" @click="changeShowCard" type="primary">高级搜索</n-button>
                    </div>
                    <div class="searchCardDiv" v-show="showCard">
                        <n-card hoverable>
                            <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left"
                                label-width="200">
                                <n-form-item label="作者" path="author">
                                    <n-input v-model:value="searchCardModel.author" placeholder="" />
                                </n-form-item>
                                <n-form-item label="机构" path="institution">
                                    <n-input v-model:value="searchCardModel.institution" placeholder="" />
                                </n-form-item>
                                <n-form-item label="出版物" path="publication">
                                    <n-popselect v-model:value="pubValue" :options="pubOptions" trigger="click">
                                        <n-button>{{ pubValue }}</n-button>
                                    </n-popselect>
                                    <n-input v-model:value="searchCardModel.publication" placeholder="" />
                                </n-form-item>
                                <n-form-item label="日期范围" path="timestamp">
                                    <n-date-picker v-model:value="searchCardModel.timestamp" type="monthrange" clearable />
                                </n-form-item>
                            </n-form>
                        </n-card>
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
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import StarBackground from '@/components/Login/StarBackground.vue';
import Clock from '@/components/Clock.vue';
import { useRoute } from 'vue-router'
import { FormInst } from 'naive-ui';

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

//高级搜索卡片
const formRef = ref<FormInst | null>(null)
const showCard = ref(false)
const changeShowCard = () => {
    showCard.value = !showCard.value
}
const pubValue = ref<string>("会议")
const pubOptions = [
    {
        label: '会议',
        value: '会议'
    },
    {
        label: '期刊',
        value: '期刊'
    },
]

interface SearchCardModelType {
    author: string | null
    institution: string | null
    timestamp: Ref<[number, number]>
    publication: string | null
}

const searchCardModel = ref<SearchCardModelType>({
    author: null,
    institution: null,
    timestamp: ref<[number, number]>([946656000000, Date.now()]),
    publication: null,
})
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
    top: 0;
    right: 0;
}

.mainContainer {
    width: 100%;
    min-height: 100vh;
    background-color: rgb(239, 239, 249);
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
    z-index: 999;
}

.menu {
    /* width: 30px; */
    height: 100%;
    /* background-color: blue; */
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url('../assets/sky.jpg');

}

.homeHeaderDiv {
    width: 100vw;
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
    height: 400px;
    position: relative;
}

.homeContentLeft {
    top: 40%;
    left: 15%;
    width: 40%;
    height: 20%;
    position: absolute;
}

.homeContentRight {
    top: 45%;
    left: 60%;
    width: 40%;
    height: 10%;
    position: absolute;
}

.slogen {
    margin-left: 40%;
    font-size: 40pt;
    width: 30%;
}

.searchBar {
    margin-left: 20%;
    width: 60%;
}

.searchBar :deep(.n-input) {
    --n-border: 'none' !important;
    --n-border-hover: 'none' !important;
    --n-border-focus: 'none' !important;
    --n-box-shadow-focus: 'none' !important;
}

.searchBar :deep(.n-input__input) {
    margin-right: 80px;
    margin-left: 80px;
}

.searchDiv {
    width: 100%;
    height: 40px;
    align-self: center;
    position: relative;
}

.extraButton {
    width: 8%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 12%;
    border-radius: 25% 0 0 25%;
}

.searchButton {
    width: 5%;
    height: 40px;
    position: absolute;
    top: 0;
    right: 15%;
    border-radius: 0 30% 30% 0;
}

.searchCardDiv {
    position: absolute;
    top: 40%;
    left: 12%;
    width: 73%;
    height: 60%;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.homeContentBottom {
    display: flex;
    flex-direction: row;
}
</style>
