<template>
    <div class="advancedSearchContainer">
        <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left" label-width="80" size="small">
            <n-form-item label="关键词" path="keyword">
                <n-input v-model:value="searchCardModel.keyword" placeholder="请输入关键词" @keyup.enter="search" />
            </n-form-item>
            <n-form-item label="作者" path="author">
                <n-input v-model:value="searchCardModel.author" placeholder="请输入作者" @keyup.enter="search" />
            </n-form-item>
            <n-form-item label="类型" path="type">
                <n-popselect v-model:value="type" style="width: 400px;" :options="typeOptions" trigger="click" scrollable>
                    <n-button style="width: 100%;">{{ type }}</n-button>
                </n-popselect>
            </n-form-item>
            <n-form-item label="机构" path="institution">
                <n-input v-model:value="searchCardModel.institution" placeholder="请输入机构名称" @keyup.enter="search" />
            </n-form-item>
            <n-form-item label="出版号" path="issn">
                <n-input v-model:value="searchCardModel.issn" placeholder="请输入出版号" @keyup.enter="search" />
            </n-form-item>
            <n-form-item label="出版物" path="publication">
                <n-input v-model:value="searchCardModel.publication" placeholder="请输入出版期刊名称" @keyup.enter="search" />
            </n-form-item>
            <n-form-item label="语言" path="publication">
                <n-popselect v-model:value="language" style="width: 400px;" :options="languageOptions" trigger="click"
                    scrollable>
                    <n-button style="width: 100%;">{{ language }}</n-button>
                </n-popselect>
            </n-form-item>
            <n-form-item label="日期范围" path="timestamp">
                <n-date-picker v-model:value="searchCardModel.timestamp" type="monthrange" clearable
                    @keyup.enter="search" />
            </n-form-item>
        </n-form>
        <div class="search">
            <n-button type="primary" @click="search">搜索</n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui';
import { onMounted, ref, Ref } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const message = useMessage()
const route = useRoute()

//高级搜索卡片
const formRef = ref<FormInst | null>(null)
interface SearchCardModelType {
    keyword: string
    author: string
    institution: string
    timestamp: Ref<[number, number]>
    publication: string
    issn: string
    type: string
    language: string
}

const searchCardModel = ref<SearchCardModelType>({
    keyword: '',
    author: '',
    institution: '',
    timestamp: ref<[number, number]>([946656000000, Date.now()]),
    publication: '',
    issn: '',
    type: '',
    language: ''
})
const languageOptions = [
    {
        label: 'en',
        value: 'en'
    },
    {
        label: 'es',
        value: 'es'
    },
    {
        label: 'de',
        value: 'de'
    },
    {
        label: 'fr',
        value: 'fr'
    },
    {
        label: 'pt',
        value: 'pt'
    },
    {
        label: 'it',
        value: 'it'
    },
    {
        label: 'ko',
        value: 'ko'
    },
    {
        label: 'tr',
        value: 'tr'
    },
    {
        label: 'ca',
        value: 'ca'
    },
    {
        label: 'null',
        value: ''
    },
]
const language = ref('')

const typeOptions = [
    {
        label: 'article',
        value: 'article'
    },
    {
        label: 'book',
        value: 'book-chapter'
    },
    {
        label: 'book',
        value: 'book'
    },
    {
        label: 'reference-entry',
        value: 'reference-entry'
    },
    {
        label: 'dataset',
        value: 'dataset'
    },
    {
        label: 'dissertation',
        value: 'dissertation'
    },
    {
        label: 'report',
        value: 'report'
    },
    {
        label: 'paratext',
        value: 'paratext'
    },
    {
        label: 'editorial',
        value: 'editorial'
    },
    {
        label: 'other',
        value: 'other'
    },
    {
        label: 'null',
        value: ''
    },
]
const type = ref('')

const search = async () => {
    if (!searchCardModel.value.keyword && 
    !searchCardModel.value.author && 
    !searchCardModel.value.institution && 
    !searchCardModel.value.publication &&
    type.value === '' &&
    !searchCardModel.value.timestamp) {
        message.error("请输入查询项")
        return;
    }

    let from_date = null
    let to_date = null
    if (searchCardModel.value.timestamp !== null) {
        if (searchCardModel.value.timestamp[0] !== null) {
            from_date = new Date(searchCardModel.value.timestamp[0])
        }
        if (searchCardModel.value.timestamp[1] !== null) {
            to_date = new Date(searchCardModel.value.timestamp[1])
        }
    }
    router.push({
        path:'/search',
        query:{
            "keyword": searchCardModel.value.keyword,
            "author": searchCardModel.value.author,
            "type": type.value,
            "issn": searchCardModel.value.issn,
            "language": language.value,
            "institution": searchCardModel.value.institution,
            "publisher": searchCardModel.value.publication,
            "from_date": from_date !== null ? (from_date.getFullYear() + '-' + (from_date.getMonth() <= 8 ? '0' + (from_date.getMonth() + 1) : (from_date.getMonth() + 1)) + '-' + '01') : '',
            "to_date": to_date !== null ? (to_date.getFullYear() + '-' + (to_date.getMonth() <= 8 ? '0' + (to_date.getMonth() + 1) : (to_date.getMonth() + 1)) + '-' + '01') : '',
        }
    })
}
onMounted(() => {
    searchCardModel.value.keyword = (route.query.keyword ??"") as string
    searchCardModel.value.author = (route.query.author ??"") as string
    searchCardModel.value.institution = (route.query.institution ??"") as string
    searchCardModel.value.publication = (route.query.publication ??"") as string
    searchCardModel.value.issn = (route.query.issn ??"") as string
    searchCardModel.value.type = (route.query.type ??"") as string
    searchCardModel.value.language = (route.query.language ??"") as string
})
</script>

<style scoped>
.advancedSearchContainer {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.v-binder-follower-content {
    width: 100% !important;
}
</style>