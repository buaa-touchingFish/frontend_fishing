<template>
    <div>
        <span class="title" @click="sendHistory">
            {{ paperItem.title.length >= 50 ? paperItem.title.substring(0, 50) + "..." : paperItem.title }}
        </span>
    </div>
    <div>
        {{ paperItem.abstract.length >= 150 ? paperItem.abstract.substring(0, 150) + "..." : paperItem.abstract }}
    </div>
    <div>
        <n-space>
            <span class="author" v-for="(author, index) in paperItem.authors" :key=index v-show="index < 5" @click="

                $router.push(
                    {
                        path: '/scholarHome',
                        query: {
                            author_name: author.display_name,
                            author_id: author.id,
                            paper_id: paperItem.id
                        }
                    }
                );">
                {{ author.display_name }};
            </span>
        </n-space>
    </div>
    <div class="foot">
        <n-space>
            <span>引用量：{{ paperItem.cited_by_count }}</span>
            <span>发布时间：{{ paperItem.publication_date }}</span>
        </n-space>
    </div>
    <n-divider />
</template>

<script setup lang='ts'>
import { post } from '@/api/axios';
import router from '@/router';
import { useMessage } from 'naive-ui'
const message = useMessage();
const props = defineProps(['paperItem'])

type paperItemType = {
    title: string,
    abstract: string,
    authors: {
        id: string,
        display_name: string
    }[],
    publication_date: string,
    cited_by_count: number,
    id: string,
    publisher: string
}
const paperItem: paperItemType = props.paperItem
const sendHistory = async () => {
    await post(message, '/history/create', { 'paper_id': paperItem.id });
    router.push('/detail/' + paperItem.id);
}
</script>

<style scoped>
.title {
    font-size: large;
    color: var(--primary-100);
}

.title:hover {
    cursor: pointer;
    text-decoration: underline;
}

.author {
    color: var(--primary-100);
}

.author:hover {
    cursor: pointer;
    text-decoration: underline;
}

.foot {
    color: gray;
}
</style>