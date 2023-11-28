<template>
    <div class="secondarySearchCardContainer shadow">
        <div class="type">{{ secondarySearch.type }}</div>
        <div class="items" v-for="(items,index) in secondarySearch.content.slice(0,3)" :key="index">
            <div class="itemName">{{ items.name }}</div>
            <div class="itemCount">({{ items.count }})</div>
        </div>
        <n-collapse-transition :show="showMore">
            <div class="items" v-for="(items,index) in secondarySearch.content.slice(3)" :key="index">
                <div class="itemName">{{ items.name }}</div>
                <div class="itemCount">({{ items.count }})</div>
            </div>
        </n-collapse-transition>
        <div class="more" v-show="secondarySearch.content.length>3" @click="showMore = !showMore">
            <n-icon :component="ChevronDown16Regular" :class="{reverse:showMore}"></n-icon>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { ChevronDown16Regular } from '@vicons/fluent'

const props = defineProps(['secondarySearch'])

type secondarySearchType = {
    type:string,
    content:{
        name:string,
        count:number
    }[]
}
const showMore = ref(false)
const secondarySearch:secondarySearchType[] = props.secondarySearch

</script>

<style scoped>
.shadow{
    box-shadow: 0 0 5px 3px #ddd;
}
.secondarySearchCardContainer{
    width: 100%;
    border-radius: 5px;
    margin-bottom: 20px;
    padding: 10px;
    box-sizing: border-box;
    background-color: white;
    position: relative;
}
.type{
    width: 100%;
    font-size: 16px;
    color: #999;
}
.items{
    margin-bottom: 1px;
    padding: 2px 5px;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    cursor: pointer;
    transition: 0.1s all linear;

    &:hover{
        background-color: #eee;
        transition: 0.1s all linear;
    }
}
.itemName{
    width: 70%;
}
.itemCount{
    width: fit-content;
}
.more{
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.1s all linear;

    &:hover{
        background-color: #eee;
        transition: 0.1s all linear;
    }
}
.reverse{
    transform:rotateZ(180deg);
    transition:0.2s all linear;
}
</style>
