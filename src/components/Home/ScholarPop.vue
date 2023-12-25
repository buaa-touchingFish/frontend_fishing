<template>
    <div style="margin-top: 2%;cursor: pointer;">
        <n-popover class="scholarPop" trigger="hover" scrollable>
            <template #trigger>
                <n-icon size="32" color="var(--primary-100)">
                    <PeopleCheckmark16Filled />
                </n-icon>
            </template>

            <div v-if="scholarList.length > 0" class="scholarBg" v-for="(scholar, index) in scholarList" @click="$router.push({
                path: '/scholarHome',
                query: {
                    author_name: scholar.name,
                    author_id: scholar.key
                }
            });">
                <n-divider v-if="index > 0"></n-divider>
                <div class="scholarItem">
                    <div class="scholarItemLeft">
                        <n-avatar round size="large" :src="scholar.imgUrl" />
                    </div>
                    <div class="scholarItemRight">
                        <div class="name">
                            {{ scholar.name }}
                        </div>
                        <div class="institution">
                            <n-ellipsis style="max-width: 240px">
                                {{ scholar.institution }}
                                <template #tooltip>
                                    <div>
                                        {{ scholar.institution }}
                                    </div>
                                </template>
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
import { PeopleCheckmark16Filled } from '@vicons/fluent'
import { onMounted, ref } from 'vue';
import { get } from '@/api/axios'
import { useMessage } from 'naive-ui';

const message = useMessage();
const scholarList = ref<ScholarData[]>([]);
type ScholarData = {
    key: string
    name: string
    institution: string
    imgUrl: string
}

onMounted(async () => {
    let res = await get(message, '/subscribe', {
        user_id: localStorage.getItem('uid')
    })
    scholarList.value = [];
    res?.map((item: any) => {
        const scholar: ScholarData = {
            key: item.id,
            name: item.display_name,
            institution: item.last_known_institution.display_name,
            imgUrl: "http://" + item.avatar,
        }
        scholarList.value.push(scholar)
    })
})
</script>

<style scoped>
.n-divider:not(.n-divider--vertical) {
    margin: 0 !important;
}

.scholarPop {
    padding: 0;
}

.scholarItem {
    display: flex;
    padding: 10px;
}

.scholarItem:hover {
    display: flex;
    padding: 10px;
    background-color: #DCDCDC;
    border-radius: 5px;
}

.scholarItemRight {
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .name {
        font-weight: bold;
    }
}
</style>