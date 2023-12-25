<template>
    <div class="secondarySearchCardContainer shadow">
        <div class="type">{{ secondarySearch.title }}</div>
        <div class="items" v-for="(item,index) in secondarySearch.items?.slice(0,3)" :key="index">
            <div class="itemName">{{ item.type }}</div>
            <div class="itemCount">({{ item.count }})</div>
        </div>
        <n-collapse-transition :show="showMore">
            <div class="items" v-for="(item,index) in secondarySearch.items?.slice(3)" :key="index">
                <div class="itemName">{{ item.type }}</div>
                <div class="itemCount">({{ item.count }})</div>
            </div>
        </n-collapse-transition>
        <div class="more" v-show="secondarySearch.items.length>3" @click="showMore = !showMore">
            <n-icon :component="ChevronDown16Regular" :class="{reverse:showMore}"></n-icon>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref,Ref } from 'vue';
import { ChevronDown16Regular } from '@vicons/fluent'

const props = defineProps(['secondarySearch'])

type secondarySearchType = {
    title:string,
    items:{
        type:string,
        count:number
    }[]
}
const showMore = ref(false)
const secondarySearch:Ref<secondarySearchType> = ref(props.secondarySearch)
const secondarySearchLabels:Ref<{[key:string]:any}> = ref({
    '时间':{
        '2020-01-01T00:00:00.000Z':{
            label:'2020以前',
            isSelected:false
        },
        '2021-01-01T00:00:00.000Z':{
            label:'2020-2021',
            isSelected:false
        },
        '2022-01-01T00:00:00.000Z':{
            label:'2021-2022',
            isSelected:false
        },
        '2023-01-01T00:00:00.000Z':{
            label:'2022-2023',
            isSelected:false
        },
    },
    '语言':{
        'en':{
            label:'英语',
            isSelected:false
        },
        'es':{
            label:'西班牙语',
            isSelected:false
        },
        'de':{
            label:'德语',
            isSelected:false
        },
        'fr':{
            label:'法语',
            isSelected:false
        },
        'pt':{
            label:'葡萄牙语',
            isSelected:false
        },
        'it':{
            label:'意大利语',
            isSelected:false
        },
        'ja':{
            label:'朝鲜语',
            isSelected:false
        },
        'tr':{
            label:'土耳其文',
            isSelected:false
        },
        'zh-cn':{
            label:'中文',
            isSelected:false
        },
        '':{
            label:'其他',
            isSelected:false
        },
    },
    '期刊类型':{
        'article':{
            label:'article',
            isSelected:false
        },
        'book-chapter':{
            label:'book chapter',
            isSelected:false
        },
        'book':{
            label:'图书',
            isSelected:false
        },
        'dataset':{
            label:'数据集',
            isSelected:false
        },
        'other':{
            label:'其他',
            isSelected:false
        },
        'report':{
            label:'新闻报道',
            isSelected:false
        },
        'reference-entry':{
            label:'引用条目',
            isSelected:false
        },
        'dissertation':{
            label:'学位论文',
            isSelected:false
        },
        'editorial':{
            label:'社论',
            isSelected:false
        },
        'erratum':{
            label:'勘误表',
            isSelected:false
        },
    },
    '期刊':{

    }
})
onMounted(() => {
    secondarySearch.value = props.secondarySearch
    if(secondarySearch.value.title == '期刊'){
        // for(const item of secondarySearch.value.items){
        //     secondarySearchLabels.value['期刊'][item.type].label = item.type;
        //     secondarySearchLabels.value['期刊'][item.type].isSelected = false;
        // }
        console.log(3);
        
        // console.log(secondarySearchLabels.value['期刊']);
        
    }
})
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
