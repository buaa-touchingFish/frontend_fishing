<template>
    <div class="advancedSearchContainer">
        <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left" label-width="80">
            <n-form-item label="关键词" path="keyword">
                <n-input v-model:value="searchCardModel.keyword" placeholder="请输入关键词" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="作者" path="author">
                <n-input v-model:value="searchCardModel.author" placeholder="请输入作者" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="机构" path="institution">
                <n-input v-model:value="searchCardModel.institution" placeholder="请输入机构名称" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="出版物" path="publication">
                <!-- <n-popselect v-model:value="pubValue" :options="pubOptions" trigger="click">
                    <n-button>{{ pubValue }}</n-button>
                </n-popselect> -->
                <n-input v-model:value="searchCardModel.publication" placeholder="请输入出版期刊名称" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="日期范围" path="timestamp">
                <n-date-picker v-model:value="searchCardModel.timestamp" type="monthrange" clearable @keyup.enter="search"/>
            </n-form-item>
        </n-form>
        <div class="search">
            <n-button type="success" @click="search">搜索</n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormInst,InputInst,useMessage } from 'naive-ui';
import { ref, Ref } from 'vue';

const message = useMessage()

//高级搜索卡片
const formRef = ref<FormInst | null>(null)
interface SearchCardModelType {
    keyword:string | null
    author: string | null
    institution: string | null
    timestamp: Ref<[number, number]>
    publication: string | null
}

const searchCardModel = ref<SearchCardModelType>({
    keyword:null,
    author: null,
    institution: null,
    timestamp: ref<[number, number]>([946656000000, Date.now()]),
    publication: null,
})
const search = () => {
    if(!searchCardModel.value.keyword && !searchCardModel.value.author && !searchCardModel.value.institution && !searchCardModel.value.publication){
        message.error("请输入查询项")
    }

    
    console.log(searchCardModel);
}
</script>

<style scoped>
.advancedSearchContainer{
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>