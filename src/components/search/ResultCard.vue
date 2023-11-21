<template>
    <div class="resultCardContainer">
        <h1 class="title">
            {{ result.title }}
        </h1>
        <div class="abstract">
            {{ result.abstract }}
        </div>
        <div class="otherInfo">

        </div>
        <div class="option">

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
.resultCardContainer{
    width: 100%;
    background-color: green;
    margin-top: 20px;
}
.title{
    width: 100%;
    height: 50px;
    margin: 0;
    font-size: 25px;
    font-weight: 400;
    display: flex;
    align-items: center;
    color: blue;
}
.abstract{
    
}
</style>
