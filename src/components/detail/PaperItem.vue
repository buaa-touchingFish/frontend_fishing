<template>
    <div>
        <span class="title">
            {{ paperItem.title }}
        </span>
    </div>
    <div>
        {{ paperItem.abstract.length>=70 ? paperItem.abstract.substring(0,70)+"..." : paperItem.abstract }}
    </div>
    <div class="author">
        <span v-for="(author, index) in paperItem.authors" :key=index>
            {{ author }}
            <span></span>
        </span>
    </div>
    <div class="foot">
        <n-space>
            <span>引用量：{{ paperItem.quotedNum }}</span>
            <span>发布时间：{{ paperItem.date }}</span>
        </n-space>
    </div>
    <n-divider/>
</template>

<script setup lang='ts'>
const props = defineProps(['paperItem'])

type paperItemType = {
    title:string,
    abstract:string,
    authors:string[],
    date:string,
    quotedNum:number,
}
const paperItem:paperItemType = props.paperItem
</script>

<style scoped>
.title{
    font-size: large;
    color: blue;
}
.title:hover{
    cursor: pointer;
}
.author{
    color: blue;
}
.foot{
    color: gray;
}
</style>