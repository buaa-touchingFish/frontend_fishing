<template>
    <div class="searchRasultContainer" v-if="!showSkeleton">
        <div class="secondarySearch" v-if="showSecondarySearchSkeleton">
            <n-skeleton v-for="i in 3" :key="i" height="150px" width="100%" style="margin-bottom:20px;border-radius: 5px;"/>
        </div>
        <div class="secondarySearch" v-else>
            <SecondarySearchCard v-for="(secondarySearch,index) in secondarySearchList" :key="index" :secondarySearch="secondarySearch"></SecondarySearchCard>
        </div>
        <div class="searchResults">
            <div class="resultTop">
                <div class="resultNumber">为您找到约{{ resultNumber }}条相关结果</div>
                <div class="sort">
                    <n-popselect v-model:value="sortValue" :options="sortOptions" trigger="click">
                        <div class="sortIcon">
                            <n-icon size="16" :component="ArrowSort16Filled"></n-icon>&nbsp;
                            <span>{{ sortValue }}</span>
                        </div>
                    </n-popselect>
                </div>
            </div>
            <div class="resultCardsContainer">
                <ResultCard v-for="(result) in resultList" :key="result.id" :result="result"></ResultCard>
            </div>
            <div class="paginator shadow" v-show="resultNumber>10">
                <n-pagination v-model:page="page" :page-count="pageCount" :page-slot="7" />
            </div>
        </div>
        <div class="recommend">
            <ReconmmendCard></ReconmmendCard>
        </div>
        <n-back-top :right="100" />
    </div>
    <div class="searchRasultContainer" v-else>
        <div class="secondarySearch">
            <n-skeleton v-for="i in 3" :key="i" height="150px" width="100%" style="margin-bottom:20px;border-radius: 5px;"/>
        </div>
        <div class="searchResults">
            <div class="resultTop">
                <div class="resultNumber">为您找到约<n-skeleton text style="width: 50px" />条相关结果</div>
                <div class="sort"><n-skeleton text style="width: 40px" /></div>
            </div>
            <div class="resultCardsContainer">
                <n-skeleton v-for="i in 5" :key="i" height="180px" width="100%" style="margin-bottom:20px;border-radius: 10px;"/>
            </div>
        </div>
        <div class="recommend">
            <n-skeleton height="800px" width="100%" style="margin-bottom:20px;border-radius: 10px;"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
//@ts-nocheck
import { onMounted,watch,ref,Ref } from 'vue';
import ResultCard from '@/components/search/ResultCard.vue'
import SecondarySearchCard from '@/components/search/SecondarySearchCard.vue'
import ReconmmendCard from '@/components/search/RecommendCard.vue'
import emitter from '@/eventBus/eventBus'
import { Paper } from '@/models/model'
import { useRoute } from 'vue-router'
import { post } from '@/api/axios';
import { useMessage } from 'naive-ui';
import { ArrowSort16Filled } from '@vicons/fluent'

const message = useMessage()
const route = useRoute()

//骨架屏
const showSkeleton = ref(false)
const showSecondarySearchSkeleton = ref(false)

// 结果数量
const resultNumber = ref(0)

//换页
const page = ref(1)
const pageCount = ref(10)

watch(page,() => {
    search()
})

// 排序
const sortValue = ref('相关性')
const currentUrl = ref('/paper/ultraSearch')
const sortOptions = [
    {label:'相关性',value:'相关性'},
    {label:'被引量',value:'被引量'},
    {label:'时间',value:'时间'},
]
watch(sortValue,() => {
    if(sortValue.value == '相关性'){
        currentUrl.value = '/paper/ultraSearch'
    }else if(sortValue.value == '被引量'){
        currentUrl.value = '/paper/citeSearch'
    }else{
        currentUrl.value = '/paper/timeSearch'
    }
    search()
})

// 搜索
const resultList:Ref<Paper[]> = ref([]);
const search = async () => {
    const query = route.query;
    const res = await post(
        message,currentUrl.value,
        {
            "pageNum": page.value-1,
            "keyword": query.keyword?? '',
            "author": query.author?? '',
            "type": query.type?? '',
            "issn": query.issn?? '',
            "language": query.language?? '',
            "institution": query.institution?? '',
            "publisher": query.publisher?? '',
            "from_date": query.from_date?? '',
            "to_date": query.to_date?? ''
        }
    )
    resultList.value = res;
    window.scrollTo(0, 0)
}
onMounted(async () => {
    showSkeleton.value = true;
    await search();
    showSkeleton.value = false;
})

//二级搜索
type secondarySearch = {
    title:string,
    items:{type:string,count:number}[]
}
const secondarySearchList:Ref<secondarySearch[]> = ref([]);
onMounted(async () => {
    showSecondarySearchSkeleton.value = true;
    const query = route.query;
    const res = await post(
        message,'/paper/aggregate',{
            "pageNum": page.value-1,
            "keyword": query.keyword?? '',
            "author": query.author?? '',
            "type": query.type?? '',
            "issn": query.issn?? '',
            "language": query.language?? '',
            "institution": query.institution?? '',
            "publisher": query.publisher?? '',
            "from_date": query.from_date?? '',
            "to_date": query.to_date?? ''
        }
    )
    secondarySearchList.value.push({title:'时间',items:res.date})
    secondarySearchList.value.push({title:'语言',items:res.lan})
    secondarySearchList.value.push({title:'期刊',items:res.publisher})
    secondarySearchList.value.push({title:'期刊类型',items:res.type})
    resultNumber.value = res.sum;
    pageCount.value = Math.ceil(resultNumber.value/10);
    showSecondarySearchSkeleton.value = false;
    console.log(res);
    
})
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
    height: fit-content;
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
    cursor: pointer;

    &:hover{
        color:var(--primary-100)
    }
}
.sortIcon{
    display: flex;
    align-items: center;
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
    margin: 0 auto 20px;
}
</style>
