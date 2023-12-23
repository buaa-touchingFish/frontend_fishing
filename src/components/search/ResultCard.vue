<template>
    <div class="resultCardContainer shadow" @click="$router.push('/detail/' + result.id);">
        <h1 class="title">
            <n-ellipsis style="max-width: 100%;color: var(--text-100);">{{ result.title }}</n-ellipsis>
        </h1>
        <div class="authors">
            <div class="author" v-for="(authorship, index) in result.authorships" :key="index" v-show="index < 5">
                <n-ellipsis style="max-width: 100px; color: var(--text-100);">{{ authorship.author.display_name
                }}</n-ellipsis>
                <div v-show="index != 4 && index != result.authorships.length - 1">,&nbsp;&nbsp;</div>
            </div>
        </div>
        <div class="publish_time_and_cited_by_count">
            <div class="publish_time">
                {{ result.publication_date }}
            </div>
            <div class="cited_by_count">
                被引量：{{ result.cited_by_count }}
            </div>
        </div>
        <div class="abstract">
            {{ result.abstract.length >= 150 ? result.abstract.substring(0, 150) + "..." : result.abstract }}
        </div>
        <div class="cardBottom">
            <div class="option">
                <n-button strong secondary round type="info" class="optionButton">收藏</n-button>
                <n-button strong secondary round type="info" class="optionButton">引用</n-button>
                <n-button strong secondary round type="info" class="optionButton">全文下载</n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { Paper } from '@/models/model'

const props = defineProps<{
    result: Paper
}>()

const result: Paper = props.result



</script>

<style scoped>
.shadow {
    box-shadow: 0 0 5px 3px #eee;
}

.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.resultCardContainer {
    width: 95%;
    margin-bottom: 15px;
    padding: 7px 20px 13px 25px;
    background-color: var(--bg-100);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: 0.2s all linear;

    &:first-child {
        margin-top: 15px;
    }

    &:hover {
        box-shadow: 0 0 10px #ccc;
        background-color: var(--card-cover);
        transition: 0.2s all linear;
    }
}

.title {
    width: 100%;
    height: 50px;
    margin: 0;
    padding: 0 10px 0 0;
    font-size: 20px;
    font-weight: 400;
    display: flex;
    align-items: center;

    cursor: pointer;
    /* view-transition-name: searchResultCardTitle; */
}

.authors {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
}

.author {
    display: flex;
}

.publish_time_and_cited_by_count {
    font-size: 13px;
    color: var(--text-200);
    display: flex;
}

.cited_by_count {
    margin-left: 20%;
}

.abstract {
    text-wrap: wrap;
    color: var(--text-200);
    font-size: 13px;
    line-height: 26px;
}

.cardBottom {
    width: 100%;
    height: 50px;
    display: flex;
}

.otherInfo {
    width: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.option {
    width: 50%;
    margin-top: 5px;
    display: flex;
    align-items: center;
}

.optionButton {
    margin-right: 7px;
    height: 30px;
}
</style>
