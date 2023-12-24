<template>
    <div class="searchRasultContainer" v-if="!showSkeleton">
        <div class="secondarySearch" v-if="!showSecondarySearchSkeleton">
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
const sortOptions = [
    {label:'相关性',value:'相关性'},
    {label:'被引量',value:'被引量'},
    {label:'时间',value:'时间'},
]
const copyedTotalresultList:Ref<Paper[]> = ref([]);
watch(sortValue,() => {
    if(sortValue.value == '相关性'){
        totalresultList.value = JSON.parse(JSON.stringify(copyedTotalresultList.value))
        resultList.value = totalresultList.value.slice((page.value-1)*10,(page.value-1)*10+10)
    }else if(sortValue.value == '被引量'){
        totalresultList.value.sort((a,b) => {
            return b.cited_by_count- a.cited_by_count;
        })
        resultList.value = totalresultList.value.slice((page.value-1)*10,(page.value-1)*10+10)
    }else{
        totalresultList.value.sort((a,b) => {
            return new Date(a.publication_date) < new Date(b.publication_date) ? 1 : -1;
        })
        resultList.value = totalresultList.value.slice((page.value-1)*10,(page.value-1)*10+10)
    }
})

// 搜索
const resultList:Ref<Paper[]> = ref([]);
const totalresultList:Ref<Paper[]> = ref([]);
const search = async () => {
    const additionValue = route.query.ad;
    const searchValue = route.query.wd;
    const res = await post(
        message,"/paper/search",
        {
            "pageNum": page.value-1,
            "keyword": additionValue == '文章' ? searchValue : "",
            "author": additionValue == '作者' ? searchValue : "",
            "institution": additionValue == '机构' ? searchValue : "",
            "publisher": additionValue == '期刊' ? searchValue : "",
        }
    )
    totalresultList.value = res
    resultList.value = totalresultList.value.slice(0,10);
    copyedTotalresultList.value = JSON.parse(JSON.stringify(res));
}
onMounted(async () => {
    showSkeleton.value = true;
    await search();
    showSkeleton.value = false;
    console.log(copyedTotalresultList.value);
})

//二级搜索
type secondarySearch = {
    sum: number,
    lan:{
        "en": number,
        "es": number,
        "": number,
        "de": number,
        "fr": number,
        "pt": number,
        "id": number,
        "ko": number,
        "tr": number,
        "ca": number
    },
    "type": {
        "article": number,
        "book-chapter": number,
        "book": number,
        "other": number,
        "reference-entry": number,
        "dataset": number,
        "dissertation": number,
        "report": number,
        "paratext": number,
        "editorial": number
    },
    "publisher": {
        "null": 1382,
        "{\"id\": \"S106296714\", \"display_name\": \"Lecture Notes in Computer Science\"}": number,
        "{\"id\": \"S4306400194\", \"display_name\": \"arXiv (Cornell University)\"}": number,
        "{\"id\": \"S52395412\", \"display_name\": \"Bioinformatics\"}": number,
        "{\"id\": \"S4306402567\", \"display_name\": \"bioRxiv (Cold Spring Harbor Laboratory)\"}": number,
        "{\"id\": \"S9692511\", \"display_name\": \"Frontiers in Psychology\"}": number,
        "{\"id\": \"S4306525036\", \"display_name\": \"PubMed\"}": number,
        "{\"id\": \"S202381698\", \"display_name\": \"PLOS ONE\"}": number,
        "{\"id\": \"S4306463708\", \"display_name\": \"Oxford University Press eBooks\"}": number
    },
    "date": {
        
    }
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
onMounted(async () => {
    showSecondarySearchSkeleton.value = true;
    const additionValue = route.query.ad;
    const searchValue = route.query.wd;
    const res = await post(
        message,'/paper/aggregate',{
            "pageNum": 0,
            "keyword": additionValue == '文章' ? searchValue : "",
            "author": additionValue == '作者' ? searchValue : "",
            "institution": additionValue == '机构' ? searchValue : "",
            "publisher": additionValue == '期刊' ? searchValue : "",
        }
    )
    resultNumber.value = res.sum;
    pageCount.value = resultNumber.value/10;
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
