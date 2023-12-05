<template>
    <div class="headerContainer">
        <div class="headerLeft">
            <div class="logo" @click="$router.push('/')">
                logo
            </div>
            <div class="searchInput">
                <n-auto-complete v-model:value="searchValue" :options="searchOptions">
                    <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
                        <n-input
                            class="searchInput"
                            type="text"
                            placeholder=""
                            size="large"
                            :value="slotValue"
                            @input="handleInput"
                            @focus="handleFocus"
                            @blur="handleBlur"
                        >
                            <template #prefix>
                                <div class="advancedSearch">
                                </div>
                            </template>
                            <template #suffix>
                                <n-icon size="20" color="blue" :component="Search12Filled" />
                            </template>
                        </n-input>
                    </template>
                </n-auto-complete>
                <n-popover trigger="click" :show-arrow="false" placement="bottom-start" raw>
                    <template #trigger>
                        <div class="advancedSearchButton">高级搜索</div>
                    </template>
                    <div class="advancedSearchCard">
                        <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left"
                            label-width="80">
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
                    </div>
                </n-popover>
            </div>
        </div>
        <div class="headerRight">
            <div class="user">
                <n-icon size="23" color="blue" :component="Person32Filled" />
            </div>
            <div class="setting">
                <n-icon size="23" color="blue" :component="Settings32Filled" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref,Ref } from 'vue';
import { Search12Filled, Person32Filled, Settings32Filled } from '@vicons/fluent';

// 输入框
const searchValue = ref("")
const searchOptions = ref([
'@gmail.com', '@163.com', '@qq.com'
])
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
.headerContainer{
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.headerLeft{
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
}
.logo{
    width: 20%;
    height: 100%;
    display: flex;
    font-size: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.searchInput{
    width: 80%;
    border-radius: 10px;
    position: relative;
}
.advancedSearch{
    width: 80px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &::after{
        content: "";
        height: 70%;
        width: 1px;
        margin: 0 8px;
        background-color: #ccc;
    }
}
.advancedSearchButton{
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

    &:hover{
        color: blue;
        transition: 0.1s all linear;
    }
}
.advancedSearchCard{
    width: calc(100vw * 0.7 * 0.7 * 0.8 * 0.8);
    background-color: white;
}
.headerRight{
    width: 30%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    flex-direction: row-reverse;
}
.user{
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.setting{
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
