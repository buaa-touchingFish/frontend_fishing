<template>
    <div>
        <n-form ref="formRef" :model="searchCardModel" rules="" label-placement="left" label-width="80">
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
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui';
import { ref, Ref } from 'vue';

//高级搜索卡片
const formRef = ref<FormInst | null>(null)
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

<style scoped></style>