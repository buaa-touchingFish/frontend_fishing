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
        </div>
        <div class="recommend">
            <ReconmmendCard :recommend="recommendList"></ReconmmendCard>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ResultCard from '@/components/search/ResultCard.vue'
import SecondarySearchCard from '@/components/search/SecondarySearchCard.vue'
import ReconmmendCard from '@/components/search/RecommendCard.vue'

// 结果数量
const resultNumber = ref(0)

// 排序


// 搜索结果
type resultType = {
    title:string,
    abstract:string,
    author:string,
    publication:string,
    publishTime:string
}
const resultList:resultType[] = [
    {
        title:'题目提明天明天明天明天明天明天',
        abstract:'摘要诉法夫阿萨撒回复啊好烦安是uohau区丰华哦是封杀和uahsuoh神佛安徽撒火放获哈搜狐发撒活佛案说法和撒行u偶是发货u欧福卅或和复赛oh撒行u发撒和u哦方式偶啊是哦发',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
    {
        title:'题目提明天明天明天明天明天明天',
        abstract:'是你的能否接受你姐夫难得看见你附件是当年的身份那是对你附件是电脑JFK送到你家附近十多年飞机速度能否接受的你尽快发你说的哦怕我都啊我的娃到我的哦萨婆菩萨佛萨麻烦看看里面',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
    {
        title:'题目提明天明天明天明天明天明天',
        abstract:'看看教程NSA参加快男撒娇内存卡洒出你就撒开承诺捐款年轻人你拉萨的那块兰芳',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
]

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
</style>
