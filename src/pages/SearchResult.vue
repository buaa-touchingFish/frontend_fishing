<template>
    <div class="searchRasultContainer">
        <div class="secondarySearch">
            <SecondarySearchCard v-for="(secondarySearch,index) in secondarySearchList" :key="index" :secondarySearch="secondarySearch"></SecondarySearchCard>
        </div>
        <div class="searchResults">
            <div class="resultTop">
                <div class="resultNumber">为您找到{{ resultNumber }}条相关结果</div>
                <div class="sort">排序</div>
            </div>
            <div class="resultCardsContainer">
                <ResultCard v-for="(result,index) in resultList" :key="index" :result="result"></ResultCard>
            </div>
            <div class="paginator shadow">
                <n-pagination v-model:page="page" :page-count="pageCount" :page-slot="7" />
            </div>
        </div>
        <div class="recommend">
            <ReconmmendCard :recommend="recommendList"></ReconmmendCard>
        </div>
        <n-back-top :right="100" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted,watch,ref,Ref } from 'vue';
import ResultCard from '@/components/search/ResultCard.vue'
import SecondarySearchCard from '@/components/search/SecondarySearchCard.vue'
import ReconmmendCard from '@/components/search/RecommendCard.vue'
import emitter from '@/eventBus/eventBus'
import { Paper } from '@/models/model'
import { useRoute } from 'vue-router'
import { post } from '@/api/axios';
import { useMessage } from 'naive-ui';

const message = useMessage()
const route = useRoute()

// 结果数量
const resultNumber = ref(0)
const page = ref(1)
const pageCount = ref(100)

watch(page,(newValue) => {
    emitter.emit("currentSearchResultPageNumber",newValue)
})


// 排序


// 搜索
const resultList:Ref<Paper[]> = ref([]);
onMounted(async () => {
    const additionValue = route.query.ad;
    const searchValue = route.query.wd;
    const res = await post(
        message,"/paper/search",
        {
            "pageNum": page.value,
            "keyword": additionValue == '文章' ? searchValue : "",
            "author": additionValue == '作者' ? searchValue : "",
            "institution": additionValue == '机构' ? searchValue : "",
            "publisher": additionValue == '期刊' ? searchValue : "",
        }
    )
    resultList.value = res
    console.log(resultList.value);
})

//二级搜索
type secondarySearch = {
    type:string,
    content:{
        name:string,
        count:number
    }[]
}
const secondarySearchList:secondarySearch[] = [
    {
        type:"时间",
        content:[
            {name:"2023以来",count:400},
            {name:"2022以来",count:300},
            {name:"2021以来",count:200}]
    },
    {
        type:"领域",
        content:[
            {name:"教育学",count:400},
            {name:"建筑学",count:300},
            {name:"冶金",count:200},
            {name:"电子科学与技术",count:400},
            {name:"通信工程",count:300},
            {name:"化学工程与技术",count:200}]
    },
    {
        type:"核心",
        content:[
            {name:"北大核心期刊",count:400},
            {name:"中国科技核心期刊",count:300}
        ]
    },{
        type:"领域",
        content:[
            {name:"教育学",count:400},
            {name:"建筑学",count:300},
            {name:"冶金",count:200},
            {name:"电子科学与技术",count:400},
            {name:"通信工程",count:300},
            {name:"化学工程与技术",count:200}]
    },
    {
        type:"领域",
        content:[
            {name:"教育学",count:400},
            {name:"建筑学",count:300},
            {name:"冶金",count:200},
            {name:"电子科学与技术",count:400},
            {name:"通信工程",count:300},
            {name:"化学工程与技术",count:200}]
    },
    {
        type:"领域",
        content:[
            {name:"教育学",count:400},
            {name:"建筑学",count:300},
            {name:"冶金",count:200},
            {name:"电子科学与技术",count:400},
            {name:"通信工程",count:300},
            {name:"化学工程与技术",count:200}]
    },
]

//推荐
type recommend = {
    title:string,
    QueryVolume:number
}
const recommendList:recommend[] = [
    {
        title:"题目1你猜猜是什么你猜猜呢踩踩踩踩踩踩踩踩",
        QueryVolume:200
    },
    {
        title:"题目2你猜猜是什么你猜猜呢",
        QueryVolume:300
    },
    {
        title:"题目3你猜猜是什么你猜猜呢",
        QueryVolume:400
    },
    {
        title:"题目4你猜猜是什么你猜猜呢",
        QueryVolume:500
    },
    {
        title:"题目5你猜猜是什么你猜猜呢",
        QueryVolume:600
    },
    {
        title:"题目1你猜猜是什么你猜猜呢",
        QueryVolume:200
    },
    {
        title:"题目2你猜猜是什么你猜猜呢",
        QueryVolume:300
    },
    {
        title:"题目3你猜猜是什么你猜猜呢",
        QueryVolume:400
    },
    {
        title:"题目4你猜猜是什么你猜猜呢",
        QueryVolume:500
    },
    {
        title:"题目5你猜猜是什么你猜猜呢",
        QueryVolume:600
    },
]
</script>

<style scoped>
.shadow{
    box-shadow: 0 0 5px 3px #ddd;
}
.searchRasultContainer{
    width: 75%;
    margin-top: 20px;
    display: flex;
}
.secondarySearch{
    width: 17%;
    height: fit-content;
}
.searchResults{
    width: 60%;
    height: 1000px;
    padding: 0 25px;
    box-sizing: border-box;
}
.resultTop{
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}
.resultNumber{
    margin-left: 5px;
}
.sort{
    margin-right: 5px;
}
.recommend{
    width: 23%;
    height: fit-content;
}
.resultCardsContainer{
    width: 100%;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.paginator{
    width: fit-content;
    padding: 10px;
    border-radius: 10px;
    background-color: white;
    margin: 0 auto;
}
</style>
