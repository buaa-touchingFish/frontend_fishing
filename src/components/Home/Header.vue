<template>
    <div class="headerDiv">
        <span class="optTitleDiv">
            {{ title }}
        </span>
        <div class="headerContainer">
            <div class="headerLeft">
                <div class="logo" @click="$router.push('/')">
                    logo
                </div>
                <div class="searchInput">
                    <!-- <n-auto-complete v-model:value="searchValue" :options="searchOptions">
                    <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }"> -->
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
                                    <n-icon style="cursor: pointer;" size="20" color="blue" :component="Search12Filled"
                                        @click="search(searchValue)" />
                                </template>
                            </n-input>
                            <!-- </template>
                </n-auto-complete> -->
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
                <div class="user" @click="userInfoModal = true">
                    <n-icon size="23" color="blue" :component="Person32Filled" />
                </div>
                <div class="setting">
                    <n-icon size="23" color="blue" :component="Settings32Filled" />
                </div>
                <n-switch v-model:value="isDark" secondary @update:value="handleChange" />
            </div>
        </div>
    </div>
    <UserInfo :userInfoModal="userInfoModal" @close="closeUserInfo" />
</template>

<script setup lang='ts'>
import { watch, ref, Ref } from 'vue';
import AdvancedSearch from '@/components/search/AdvancedSearch.vue';
import UserInfo from '@/components/Home/UserInfo.vue'
import { Search12Filled, Person32Filled, Settings32Filled } from '@vicons/fluent';
import emitter from '@/eventBus/eventBus';
import router from '@/router'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/store/themeStore';
import { storeToRefs } from 'pinia';
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
import { post } from '@/api/axios'

const route = useRoute()
// 输入框
const searchValue = ref("")
const showComplete = ref(false)
const completeSearchOptionsSuffix = ref(['@gmail.com', '@163.com', '@qq.com'])
const currentCompleteSearchOptionIndex = ref(-1)
const copySearchValue = ref("")
let completeSearchOptions: Ref<{ label: string, isSelect: boolean }[]>;
const searchInput: Ref<any> = ref(null)
let time: any;
const searchComplete = async () => {
    copySearchValue.value = searchValue.value;
    if (!searchValue.value) {
        showComplete.value = false;
        return
    }
    if (time) {
        clearTimeout(time);
    }
    time = setTimeout(() => {
        // await post()
    }, 200)
    currentCompleteSearchOptionIndex.value = -1;
    completeSearchOptions = ref(completeSearchOptionsSuffix.value.map((suffix) => {
        const prefix = searchValue.value
        return {
            label: prefix + suffix,
            isSelect: false
        }
    }))

    showComplete.value = true;
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
    router.push({
        path: '/search',
        query: {
            wd: value,
            ad: additionValue.value
        }
    })
}
//标题
const title = ref("")
emitter.on("titleChange", (data: any) => title.value = data)

function handleChange(value: boolean) {
    emitter.emit("themeChange", value);
}
watch(() => route.query, (newValue) => {
    if (newValue.wd) {
        searchValue.value = newValue.wd as string
    }
    if(newValue.ad){
        additionValue.value = newValue.ad as string
    }
}, { immediate: true, deep: true })

//个人信息
const userInfoModal = ref(false);
const closeUserInfo = (value:boolean) => {
    userInfoModal.value = value
}
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
    flex-direction: row-reverse;
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

    &:hover {
        color: blue;
        transition: 0.1s all linear;
    }
}

.advancedSearchCard {
    width: calc(100vw * 0.7 * 0.7 * 0.8 * 0.8);
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--bg-100);
}

.headerRight {
    width: 30%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    flex-direction: row-reverse;
}

.user {
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.setting {
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
