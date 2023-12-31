<template>
    <div>
        <n-data-table :loading="loading" :columns="columns" :data="data" :pagination="pagination" />
        <n-modal v-model:show="showModal">
            <n-card style="width: 600px; display: flex; justify-content: center; align-items: center;" title="详情"
                :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-image v-if="type === 'claim'" width="100" :src="imgUrl" />
                <n-input v-else :value="content" disabled round />
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
    loading.value = false
    data.value = []
    res?.map((item: any) => {
        const row: RowData = {
            key: item.claimRequest.id + '@claim',
            name: item.author.display_name,
            username: item.user.username,
            email: item.user.email,
            time: item.claimRequest.create_time,
            imgUrl: item.claimRequest.photo_url,
            content: '',
            type: 'claim'
        }
        data.value.push(row)
    })
    res = await get(message, '/admin/unappealed', {})
    if (res === false) {
        return
    }
    res?.map((item: any) => {
        const row: RowData = {
            key: item.paperAppeal.id + '@appeal',
            name: item.paper.title,
            username: item.user.username,
            email: item.user.email,
            time: item.paperAppeal.create_time,
            imgUrl: '',
            content: item.paperAppeal.content,
            type: 'appeal'
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
    content: string
    type: string
}
const message = useMessage();
const showModal = ref(false);
const type = ref('')
const imgUrl = ref('')
const content = ref('')
const displayDetail = (row: RowData) => {
    imgUrl.value = "http://" + row.imgUrl
    content.value = row.content
    type.value = row.type
    showModal.value = true
}

const pass = async (row: RowData) => {
    let res;
    if (row.type === 'claim') {
        res = await post(message, '/admin/handle/claim', {
            "claimRequestId": row.key.split('@')[0],
            "result": true
        })
    } else {
        res = await post(message, '/admin/handle/appeal', {
            "id": row.key.split('@')[0],
            "result": true
        })
    }
    if (res === false) {
        return
    }
    data.value = data.value.filter((item) => {
        return item.key !== row.key
    })
}

const deny = async (row: RowData) => {
    let res;
    if (row.type === 'claim') {
        res = await post(message, '/admin/handle/claim', {
            "claimRequestId": row.key.split('@')[0],
            "result": false
        })
    } else {
        res = await post(message, '/admin/handle/appeal', {
            "id": row.key.split('@')[0],
            "result": false
        })
    }
    if (res === false) {
        return
    }
    data.value = data.value.filter((item) => {
        return item.key !== row.key
    })
}

const columns: DataTableColumns = [
    {
        title: '事务主体名',
        key: 'name',
    },
    {
        title: '账户名',
        key: 'username',
    },
    {
        title: '时间',
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