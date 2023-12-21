<template>
    <div>
        <n-data-table :columns="columns" :data="data" :pagination="pagination" />
    </div>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { Ref, ref } from 'vue';

type RowData = {
    key: string
    name: string
    username: string
    email: string
    time: string
    institution: string
}

const columns: DataTableColumns = [
    {
        title: '学者姓名',
        key: 'name',
    },
    {
        title: '账户名',
        key: 'username',
    },
    {
        title: '入驻时间',
        key: 'time',
    },
    {
        title: '机构',
        key: 'institution',
    },
    {
        title: '联系邮箱',
        key: 'email',
    },
]

const data: Ref<RowData[]> = ref([
])

const pagination = {
    pageSize: 5
}


</script>

<style scoped></style>