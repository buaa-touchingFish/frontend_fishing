<template>
    <div class="resultCardContainer shadow">
        <h1 class="title">
            {{ result.title }}
        </h1>
        <div class="abstract">
            {{ result.abstract.length>=70 ? result.abstract.substring(0,70)+"..." : result.abstract }}
        </div>
        <div class="cardBottom">
            <div class="otherInfo">
                {{ result.author }} - {{ result.publication }} - {{ result.publishTime }}
            </div>
            <div class="option">
                <n-button strong secondary round type="info" class="optionButton">全文下载</n-button>
                <n-button strong secondary round type="info" class="optionButton">引用</n-button>
                <n-button strong secondary round type="info" class="optionButton">收藏</n-button>
            </div>
        </div>
        
    </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps(['result'])
type resultType = {
    title:string,
    abstract:string,
    author:string,
    publication:string,
    publishTime:string
}
const result:resultType = props.result

</script>

<style scoped>
.shadow{
    box-shadow: 0 0 5px 3px #eee;
}
.resultCardContainer{
    width: 95%;
    margin-bottom: 15px;
    padding: 7px 10px 13px 15px;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: 0.2s all linear;

    &:first-child{
        margin-top: 15px;
    }

    &:hover{
        box-shadow: 0 0 10px #ccc;
        background-color: rgb(232, 232, 254);
        transition: 0.2s all linear;
    }
}
.title{
    width: 100%;
    height: 50px;
    margin: 0;
    margin-left: 5px;
    padding: 0;
    font-size: 22px;
    font-weight: 400;
    display: flex;
    align-items: center;

    cursor: pointer;
}
.abstract{
    text-wrap: wrap;
    color: #555;
    font-size: 13px;
    line-height: 26px;
}
.cardBottom{
    width: 100%;
    height: 50px;
    display: flex;
}
.otherInfo{
    width: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.option{
    width: 50%;
    margin-top: 5px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}
.optionButton{
    margin-right: 7px;
    height: 30px;
}
</style>
