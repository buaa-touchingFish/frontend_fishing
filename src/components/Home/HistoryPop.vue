<template>
    <div style="margin-top: 2%;cursor: pointer;">
        <n-popover class="historyPop" trigger="hover" scrollable style="height: 300px;">
            <template #trigger>
                <n-icon size="32" color="var(--primary-100)">
                    <Clock28Filled />
                </n-icon>
            </template>

            <div class="historyBg" v-if="historyList.length > 0" v-for="(history, index) in historyList" @click="$router.push('/detail/' + history.key)">
                <n-divider v-if="index > 0"></n-divider>
                <div class="historyItem">
                    <div class="noticeItemLeft">
                        <n-icon size="20">
                            <BookOpen32Filled />
                        </n-icon>

                    </div>
                    <div class="historyItemRight">
                        <div class="name">
                            <n-ellipsis style="max-width: 200px">
                                {{ history.title }}
                            </n-ellipsis>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else style="width: 240px;">
                <n-empty></n-empty>
            </div>
        </n-popover>
    </div>
</template>

<script setup lang="ts">
import { Clock28Filled, BookOpen32Filled } from '@vicons/fluent'
import { onMounted, ref } from 'vue';
import { get, post } from '@/api/axios'
import { useMessage } from 'naive-ui';

const message = useMessage();
const historyList = ref<historyData[]>([]);
type historyData = {
    key: string
    title: string
}

onMounted(async () => {
    let res = await get(message, '/history/get/user', {
    })
    historyList.value = [];
    res?.map((item: any) => {
        const history: historyData = {
            key: item.paper_id,
            title: item.paper_name,
        }
        historyList.value.push(history)
    })
})

</script>

<style scoped>
.n-divider:not(.n-divider--vertical) {
    margin: 0 !important;
}

.historyPop {
    padding: 0;
}

.historyItem {
    display: flex;
    padding: 10px;
}

.historyItem:hover {
    display: flex;
    padding: 10px;
    background-color: #DCDCDC;
    border-radius: 5px;
}

.historyItemLeft {
    display: flex;
    justify-content: center;
    align-items: center;
}

.historyItemRight {
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .name {
        overflow-x: hidden;

    }
}
</style>