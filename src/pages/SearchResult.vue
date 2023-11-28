<template>
    <div class="searchRasultContainer">
        <div class="secondarySearch">

        </div>
        <div class="searchResults">
            <div class="resultTop">
                <div class="resultNumber">
                    为您找到{{ resultNumber }}条相关结果
                </div>
                <div class="sort">
                    排序
                </div>
            </div>
            <ResultCard v-for="(result,index) in resultList" :key="index" :result="result"></ResultCard>
        </div>
        <div class="recommend">

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ResultCard from '@/components/search/ResultCard.vue'

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
        title:'题目',
        abstract:'摘要adnfaebfobaeuifanklanvlksdanfklsnalkfnsaklfnancfahjdfioasnmcklsnalkfnalfnklcfnlaerno;fdWILFNBGJKWNBJKAEBKLFBNAKSJBGJKWEBNFJKSRBJKEBJKAEBJKBNEAJKBJKN',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
    {
        title:'题目',
        abstract:'摘要adnfaebfobaeuifanklanvlksdanfklsnalkfnsaklfnancfahjdfioasnmcklsnalkfnalfnklcfnlsdnjkfnsdnfjdfnjksdnfjdsnjkfnsdjkfnsjkfnjknfjksdnfdsnjkfnsdjknfsjnsjf',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
    {
        title:'题目',
        abstract:'摘要adnfaebfobaeuifanklanvlksdanfklsnalkfnsaklfnancfahjdfioasnmcklsnalkfnalfnklcfnl',
        author:'作者',
        publication:'刊物',
        publishTime:'发布时间：2019-6'
    },
]
</script>

<style scoped>
.searchRasultContainer{
    width: 70%;
    height: 1000px;
    margin-top: 20px;
    display: flex;
}
.secondarySearch{
    width: 17%;
    background-color: red;
}
.searchResults{
    width: 60%;
    padding: 0 13px;
    box-sizing: border-box;
}
.resultTop{
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
}
.recommend{
    width: 23%;
    background-color: blue;
}
</style>
