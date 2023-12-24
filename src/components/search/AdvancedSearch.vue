<template>
    <div class="advancedSearchContainer">
        <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left" label-width="80" size="small">
            <n-form-item label="关键词" path="keyword">
                <n-input v-model:value="searchCardModel.keyword" placeholder="请输入关键词" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="作者" path="author">
                <n-input v-model:value="searchCardModel.author" placeholder="请输入作者" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="类型" path="type">
                <n-input v-model:value="searchCardModel.type" placeholder="请输入作者" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="机构" path="institution">
                <n-input v-model:value="searchCardModel.institution" placeholder="请输入机构名称" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="出版号" path="issn">
                <n-input v-model:value="searchCardModel.issn" placeholder="请输入作者" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="出版物" path="publication">
                <n-input v-model:value="searchCardModel.publication" placeholder="请输入出版期刊名称" @keyup.enter="search"/>
            </n-form-item>
            <n-form-item label="出版物" path="publication">
                <n-popselect v-model:value="language" :options="languageOptions" trigger="click">
                    <n-button>{{ language }}</n-button>
                </n-popselect>
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
    keyword:string
    author: string
    institution: string
    timestamp: Ref<[number, number]>
    publication: string
    issn: string
    type: string
}

const searchCardModel = ref<SearchCardModelType>({
    keyword: '',
    author: '',
    institution: '',
    timestamp: ref<[number, number]>([946656000000, Date.now()]),
    publication: '',
    issn: '',
    type: ''
})
const languageOptions = [
    {
        label: '111',
        value: '222'
    }
]
const language = ref('')

const search = () => {
    if(!searchCardModel.value.keyword && !searchCardModel.value.author && !searchCardModel.value.institution && !searchCardModel.value.publication){
        message.error("请输入查询项")
    }

    const from_date = new Date(searchCardModel.value.timestamp[0])
    const to_date = new Date(searchCardModel.value.timestamp[1])
    console.log(searchCardModel.value);
}
</script>

<style scoped>
.advancedSearchContainer{
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>