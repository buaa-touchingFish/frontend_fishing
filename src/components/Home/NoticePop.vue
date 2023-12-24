<template>
    <div>
        <n-popover class="noticePop" trigger="hover" scrollable>
            <template #trigger>
                <n-icon size="40">
                    <CommentNote20Filled />
                </n-icon>
            </template>

            <div class="noticeBg" v-for="(notice, index) in noticeList" @click="read(notice)">
                <n-divider v-if="index > 0"></n-divider>
                <div class="noticeItem">
                    <div class="noticeItemLeft">
                        <n-icon v-if="!notice.status" size="20">
                            <Info24Regular></Info24Regular>
                        </n-icon>
                        <n-icon v-else size="20">
                            <CheckmarkStarburst20Regular></CheckmarkStarburst20Regular>
                        </n-icon>
                    </div>
                    <div class="noticeItemRight">
                        <div class="name">
                            {{ notice.title }}
                        </div>
                        <div class="content">
                            <n-ellipsis style="max-width: 240px">
                                {{ notice.content }}
                                <template #tooltip>
                                    <div>
                                        {{ notice.content }}
                                    </div>
                                </template>
                            </n-ellipsis>
                        </div>
                    </div>
                </div>
            </div>
        </n-popover>
    </div>
</template>

<script setup lang="ts">
import { CommentNote20Filled, Info24Regular, CheckmarkStarburst20Regular } from '@vicons/fluent'
import { onMounted, ref } from 'vue';
import { get, post } from '@/api/axios'
import { useMessage } from 'naive-ui';

const message = useMessage();
const noticeList = ref<noticeData[]>([]);
type noticeData = {
    key: string
    title: string
    content: string
    create_time: string
    status: boolean
}

onMounted(async () => {
    let res = await post(message, '/notice/get', {
        uid: localStorage.getItem('uid')
    })
    
    noticeList.value = [];
    res.map((item: any) => {
        const notice: noticeData = {
            key: item.id,
            title: item.title,
            content: item.content,
            create_time: item.create_time,
            status: item.read_status,
        }
        noticeList.value.push(notice)
    })
    res = await get(message, '/history/get/user', {
    })
    console.log(res);
})

const read = async (notice:noticeData) => {
    if (notice.status) {
        return
    }
    let res = await post(message, '/notice/update', {
        id: notice.key
    })
    noticeList.value.map((item) => {
        if (item.key === notice.key) {
            item.status = true
        }
    })
    
    
}

</script>

<style scoped>
.n-divider:not(.n-divider--vertical) {
    margin: 0 !important;
}

.noticePop {
    padding: 0;
}

.noticeItem {
    display: flex;
    padding: 10px;
}

.noticeItem:hover {
    display: flex;
    padding: 10px;
    background-color: #DCDCDC;
    border-radius: 5px;
}
.noticeItemLeft {
    display: flex;
    justify-content: center;
    align-items: center;
}

.noticeItemRight {
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .name {
        font-weight: bold;
    }
}
</style>