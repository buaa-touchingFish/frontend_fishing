<template>
    <div>
        <n-data-table :loading="loading" :columns="columns" :data="data" :pagination="pagination" />
    </div>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { Ref, onMounted, ref } from 'vue';
import { get } from '@/api/axios';

type RowData = {
    key: string
    username: string
    time: string
    handle_time: string
    type: string
}

const message = useMessage();
const loading = ref(true)


onMounted(async () => {
    let res = await get(message, '/admin/myclaims', {})
    if (res === false) {
        return
    }
    
    data.value = []
    res?.map((item: any) => {
        const row: RowData = {
            key: item.claimRequest.id,
            type: '门户认领',
            handle_time: item.claimRequest.handle_time,
            username: item.user.username,
            time: item.claimRequest.create_time,
        }
        data.value.push(row)
    })
    res = await get(message, '/admin/myappeal', {})
    if (res === false) {
        return
    }
    res?.map((item: any) => {
        const row: RowData = {
            key: item.paperAppeal.id,
            type: '文章申诉',
            handle_time: item.paperAppeal.handle_time,
            username: item.user.username,
            time: item.paperAppeal.create_time,
        }
        data.value.push(row)
    })
    loading.value = false

})

const columns: DataTableColumns = [
    {
        title: '事务账户',
        key: 'username',
    },
    {
        title: '事务类型',
        key: 'type',
    },
    {
        title: '申请时间',
        key: 'time',
    },
    {
        title: '处理时间',
        key: 'handle_time',
    },
]

const data: Ref<RowData[]> = ref([
])

const pagination = {
    pageSize: 5
}


</script>

<style scoped></style>