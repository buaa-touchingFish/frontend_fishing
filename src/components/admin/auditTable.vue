<template>
    <div>
        <n-data-table :loading="loading" :columns="columns" :data="data" :pagination="pagination" />
        <n-modal v-model:show="showModal">
            <n-card style="width: 600px; display: flex; justify-content: center; align-items: center;" title="详情" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-image width="100" :src="imgUrl" />
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { Ref, h, onMounted, ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { get, post } from '@/api/axios';

const loading = ref(true)

onMounted(async () => {
    let res = await get(message, '/admin/unclaimed', {})
    if (res === false) {
        return
    }
    console.log(res);
    loading.value = false
    data.value = []
    res.map((item: any) => {
        const row: RowData = {
            key: item.claimRequest.applicant_id,
            name: item.author.display_name,
            username: item.user.username,
            email: item.user.email,
            time: item.claimRequest.create_time,
            imgUrl: item.claimRequest.photo_url
        }
        data.value.push(row)
    })
})

type RowData = {
    key: string
    name: string
    username: string
    email: string
    time: string
    imgUrl: string
}
const message = useMessage();
const showModal = ref(false);
const imgUrl = ref('')
const displayDetail = (row: RowData) => {
    imgUrl.value = "http://" + row.imgUrl
    console.log(row.imgUrl);
    
    showModal.value = true
}

const pass = async (row: RowData) => {
    let res = await post(message, '/admin/handle/claim', {
        "claimRequestId": row.key,
        "result": true
    })
    if (res === false) {
        return
    }
    data.value = data.value.filter((item) => {
        return item.key !== row.key
    })
}

const deny = async (row: RowData) => {
    let res = await post(message, '/admin/handle/claim', {
        "claimRequestId": row.key,
        "result": false
    })
    if (res === false) {
        return
    }
    data.value = data.value.filter((item) => {
        return item.key !== row.key
    })
}

const columns: DataTableColumns = [
    {
        title: '学者名',
        key: 'name',
    },
    {
        title: '申请账户名',
        key: 'username',
    },
    {
        title: '申请时间',
        key: 'time',
    },
    {
        title: '联系邮箱',
        key: 'email',
    },
    {
        title: '操作',
        key: 'actions',
        width: 20,
        render(row) {
            return h('div', {
                style: {
                    width: "20%",
                    display: "flex"
                }
            }, [
                h(
                    NButton,
                    {
                        // @ts-ignore
                        onClick: () => displayDetail(row),
                        type: 'info',
                        style: {
                            marginRight: "10px"
                        }
                    },
                    { default: () => '详情' }
                ),
                h(
                    NButton,
                    {
                        // @ts-ignore
                        onClick: () => pass(row),
                        type: 'success',
                        style: {
                            marginRight: "10px"
                        }
                    },
                    { default: () => '通过' }
                ),
                h(
                    NButton,
                    {
                        // @ts-ignore
                        onClick: () => deny(row),
                        type: 'error',
                        style: {
                        }
                    },
                    { default: () => '拒绝' }
                )
            ]);
        }
    }
]

const data: Ref<RowData[]> = ref([
])

const pagination = {
    pageSize: 5
}
</script>

<style scoped></style>