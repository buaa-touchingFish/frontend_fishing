<template>
    <div class="headerDiv">
        <span class="optTitleDiv">
            {{ title }}
        </span>
        <div class="headerContainer">
            <div class="headerLeft">
                <div class="logo" @click="$router.push('/')">
                    <img src="../../assets/AcadVista-长款.png" width="150"/>
                </div>
                <div class="searchInput">
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
                                    <n-icon style="cursor: pointer;" size="20" color="var(--primary-100)"
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
                    <n-popover trigger="click" :show-arrow="false" placement="bottom-start" raw>
                        <template #trigger>
                            <div class="advancedSearchButton">高级搜索</div>
                        </template>
                        <div class="advancedSearchCard">
                            <AdvancedSearch></AdvancedSearch>
                        </div>
                    </n-popover>
                    <div class="selectAddition">
                        <n-select class="additionSelector" v-model:value="additionValue" :options="options" size="small"
                            :show-arrow="false" :show-checkmark="false" />
                    </div>
                </div>
            </div>
            <div class="headerRight">
                <n-button text v-if="!ifLogin" @click="$router.push('/login')">去登录</n-button>
                <UserInfo v-if="ifLogin"></UserInfo>
                <Subscribe v-if="ifLogin"></Subscribe>
                <Notice v-if="ifLogin"></Notice>
                <History v-if="ifLogin"></History>
                <n-switch v-model:value="isDark" secondary @update:value="handleChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { watch, ref, Ref, onMounted } from 'vue';
import AdvancedSearch from '@/components/search/AdvancedSearch.vue';
import UserInfo from '@/components/Home/UserInfo.vue'
import Subscribe from '@/components/Home/ScholarPop.vue'
import Notice from '@/components/Home/NoticePop.vue'
import History from '@/components/Home/HistoryPop.vue' 
import { Search12Filled, Settings32Filled } from '@vicons/fluent';
import emitter from '@/eventBus/eventBus';
import router from '@/router'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/store/themeStore';
import { storeToRefs } from 'pinia';
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
import { post } from '@/api/axios'
import { useMessage } from 'naive-ui'

const route = useRoute()
const message = useMessage()

// 输入框
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
        res = await post(message, '/paper/suggest', {
            query: searchValue.value
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

const additionValue = ref("文章")
const options = [
    { label: '文章', value: '文章' },
    { label: '作者', value: '作者' },
    { label: '期刊', value: '期刊' },
    { label: '机构', value: '机构' },
]
const currentSearchResultPageNumber = ref(0)
emitter.on("currentSearchResultPageNumber", (data: any) => currentSearchResultPageNumber.value = data)
const search = async (value: string) => {
    let query:{[key:string]:any} =  {}
    switch (additionValue.value) {
        case '文章':
            query.keyword = value;
            break;
        case '作者':
            query.author = value;
            break;
        case '期刊':
            query.publisher = value;
            break;
        case '机构':
            query.institution = value;
            break;
    }
    router.push({
        path: '/search',
        query,
    })
}
//标题
const title = ref("")
emitter.on("titleChange", (data: any) => title.value = data)

function handleChange(value: boolean) {
    emitter.emit("themeChange", value);
}
watch(() => route.query, (newValue) => {
    if (newValue.keyword) {
        searchValue.value = newValue.keyword as string
        additionValue.value = '文章'
        return;
    }
    if (newValue.author) {
        searchValue.value = newValue.author as string
        additionValue.value = '作者'
        return;
    }
    if (newValue.publisher) {
        searchValue.value = newValue.publisher as string
        additionValue.value = '期刊'
        return;
    }
    if (newValue.institution) {
        searchValue.value = newValue.institution as string
        additionValue.value = '机构'
        return;
    }
}, { immediate: true, deep: true })

//判断是否登录
const ifLogin = ref(false)
onMounted(() => {
    if(localStorage.getItem('token')){
        ifLogin.value = true
    }else{
        ifLogin.value = false
    }
})
</script>

<style scoped>
.headerDiv {
    width: 100%;
    display: flex;
    position: relative;
}

.optTitleDiv {
    width: 180px;
    max-width: 180px;
    font-size: 16pt;
    position: absolute;
    line-height: 50px;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    overflow: hidden;
    left: 20px;
    text-overflow: ellipsis;
    color: var(--text-100);
}

.headerContainer {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
}

.headerLeft {
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
}

.headerRight {
    width: 30%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.logo {
    width: 20%;
    height: 100%;
    display: flex;
    font-size: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--text-100);
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

.advancedSearch {
    width: 80px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &::after {
        content: "";
        height: 70%;
        width: 1px;
        margin: 0 8px;
        background-color: #ccc;
    }
}

.selectPlaceHolder {
    height: 100%;
    width: 65px;
}

.selectAddition {
    height: 100%;
    width: 55px;
    position: absolute;
    top: 17%;
    right: 27%;
}

.additionSelector {
    width: 100%;
    height: 100%;
}

.additionSelector :deep(.n-base-selection-input) {
    width: fit-content;
}

.advancedSearchButton {
    width: 72px;
    height: 100%;
    cursor: pointer;
    transition: 0.1s all linear;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: var(--text-100);

    &:hover {
        color: var(--primary-100);
        transition: 0.1s all linear;
    }
}

.advancedSearchCard {
    width: calc(100vw * 0.7 * 0.7 * 0.8 * 0.8);
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--bg-100);
}

.setting {
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
