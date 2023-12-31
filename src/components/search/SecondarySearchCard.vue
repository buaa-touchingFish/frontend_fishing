<template>
    <div class="secondarySearchCardContainer shadow">
        <div class="type">
            <n-icon :size="20" :component="secondarySearchLabels.icon"/>&nbsp;
            <span>{{ secondarySearchLabels.title }}</span>
        </div>
        <div class="items" :class="{select:item.isSelect}" v-for="(item,index) in secondarySearchLabels.items.slice(0,3)" :key="index" @click="search(item)">
            <div class="itemName"><n-ellipsis style="max-width: 100%;">{{ item.label }}</n-ellipsis></div>
            <div class="itemCount">({{ item.count }})</div>
        </div>
        <n-collapse-transition :show="showMore">
            <div class="items" :class="{select:item.isSelect}" v-for="(item,index) in secondarySearchLabels.items.slice(3)" :key="index" @click="search(item)">
                <div class="itemName"><n-ellipsis style="max-width: 100%;">{{ item.label }}</n-ellipsis></div>
                <div class="itemCount">({{ item.count }})</div>
            </div>
        </n-collapse-transition>
        <div class="more" v-show="secondarySearchLabels.items.length>3" @click="showMore = !showMore">
            <n-icon :component="ChevronDown16Regular" :class="{reverse:showMore}"></n-icon>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref,Ref } from 'vue';
import { ChevronDown16Regular } from '@vicons/fluent'
import { useRoute } from 'vue-router';
import router from '@/router';

const props = defineProps(['secondarySearch'])
const route = useRoute()

type secondarySearchType = {
    title:string,
    items:{
        type:string,
        count:number
    }[]
}
const showMore = ref(false)
const secondarySearch = ref(props.secondarySearch);
const secondarySearchLabels = ref({title:secondarySearch.value.title,icon:secondarySearch.value.icon,items:[]})
onMounted(() => {
    secondarySearch.value = props.secondarySearch
    const lan = route.query.language;
    const to_date = route.query.to_date as string;
    let publisher = route.query.publisher as string;
    publisher = publisher?.substring(publisher.indexOf(':')+1)
    publisher = publisher?.substring(1,publisher.length-1)
    const type = route.query.type;
    if(secondarySearch.value.title == '期刊'){
        for(const i of secondarySearch.value.items){
            secondarySearchLabels.value.items.push({
                label:i.publisher.display_name,
                id:i.publisher.id,
                count:i.count,
                isSelect:i.publisher.display_name == publisher
            })
        }
        secondarySearchLabels.value.items.sort((a,b) => {if(a.isSelect)return -1;})
    }else if(secondarySearch.value.title == '时间'){
        for(const i of secondarySearch.value.items){
            let label,isSelect;
            switch (i.type as string) {
                case '2020-01-01T00:00:00.000Z':
                    label = '2020年之前'
                    isSelect = to_date == '2020-01-01'
                    break;
                case '2021-01-01T00:00:00.000Z':
                    label = '2020-2021'
                    isSelect = to_date == '2021-01-01'
                    break;
                case '2022-01-01T00:00:00.000Z':
                    label = '2021-2022'
                    isSelect = to_date == '2022-01-01'
                    break;
                case '2023-01-01T00:00:00.000Z':
                    label = '2022-2023'
                    isSelect = to_date == '2023-01-01'
                    break;
                default:
                    label =  i.type;
                    isSelect = to_date != '2023-01-01' && to_date?.substring(0,4) == '2023'
                    break;
            };
            secondarySearchLabels.value.items.unshift({
                label: label,
                count:i.count,
                isSelect:isSelect
            })
        }
        secondarySearchLabels.value.items.sort((a,b) => {if(a.isSelect)return -1;})
    }else if(secondarySearch.value.title == '期刊类型'){
        for(const i of secondarySearch.value.items){
            secondarySearchLabels.value.items.push({label:i.type,count:i.count,isSelect:i.type == type})
        }
        secondarySearchLabels.value.items.sort((a,b) => {if(a.isSelect)return -1;})
    }else{
        for(const i of secondarySearch.value.items){
            secondarySearchLabels.value.items.push({label:i.type,count:i.count,isSelect:i.type == lan})
        }
        secondarySearchLabels.value.items.sort((a,b) => {if(a.isSelect)return -1;})
    }
})
const search = (item:any) => {
    let from,to;
    if(secondarySearchLabels.value.title == '时间'){
        if(item.label == '2020年之前'){
            from = '2000-01-01'
            to = '2020-01-01'
        }else if(item.label == '2020-2021'){
            from = '2020-01-01'
            to = '2021-01-01'
        }else if(item.label == '2021-2022'){
            from = '2021-01-01'
            to = '2022-01-01'
        }else if(item.label == '2022-2023'){
            from = '2022-01-01'
            to = '2023-01-01'
        }else if(item.label == '2023年至今'){
            from = '2023-01-01'
            let now = new Date()
            to = now.getFullYear()+'-'+ (now.getMonth() <= 8 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '-' + '01'
            console.log(to);
            
        }
    }
    router.push({
        path:'/search',
        query:{
            "keyword": route.query.keyword??'',
            "author": route.query.author??'',
            "type": secondarySearchLabels.value.title == '期刊类型'? (item.isSelect? '' :  item.label) : route.query.type??'',
            "issn": route.query.issn??'',
            "language": secondarySearchLabels.value.title == '语言'? (item.isSelect? '' :  item.label) : route.query.language??'',
            "institution": route.query.institution??'',
            "publisher": secondarySearchLabels.value.title == '期刊'? (item.isSelect? '' : '\"display_name\":\"'+item.label+'\"') : route.query.publisher??'',
            "from_date": secondarySearchLabels.value.title == '时间'? (item.isSelect? '' : from) : route.query.from_date??'',
            "to_date": secondarySearchLabels.value.title == '时间'? (item.isSelect? '' : to) : route.query.to_date??'',
        }
    })
}
</script>

<style scoped>
.shadow{
    box-shadow: 0 0 5px 3px black;
}
.secondarySearchCardContainer{
    width: 100%;
    border-radius: 5px;
    margin-bottom: 20px;
    padding: 10px;
    box-sizing: border-box;
    background-color: var(--bg-100);
    position: relative;
}
.type{
    width: 100%;
    font-size: 16px;
    color: var(--primary-100);
    display: flex;
    align-items: center;
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
    color: var(--text-100);

    &:hover{
        background-color: #eee;
        transition: 0.1s all linear;
    }
}
.select{
    background-color: var(--primary-300);
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
    color: var(--text-100);

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
