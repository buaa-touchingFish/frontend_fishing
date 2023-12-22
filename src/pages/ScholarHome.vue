<template>
    <div class="rootDiv" id="rootDiv">
        <div class="scholarDivBorder">
            <div class="scholarDiv">
                <div class="imageDiv">
                    <n-avatar round :size="128"
                        src="https://x0.ifengimg.com/res/2020/79AF4AE1EC8333953CBE4B3B3D0529A6E1FB6186_size217_w1080_h1171.jpeg" />
                    <n-button class="claimButton" @click="$router.push({
                        path: '/claimScholar',
                        query: {
                            author_name: scholarName,
                            author_id: scholarID
                        }
                    })">我要认证</n-button>
                </div>
                <div class="verticalSplitDiv"></div>
                <div class="infoDiv">
                    <div class="nameDiv">
                        <p class="nameSpan" id="authorName">
                            {{ scholarName }}</p>
                        <span class="idSpan">scholarID :
                            {{ scholarID }}
                        </span>
                    </div>
                    <n-skeleton v-if="loading" block :width="146" height="30px" :sharp="false" size="small" />
                    <span v-else class="briefInfo">
                        <n-icon size="22">
                            <BuildingHome20Filled />
                        </n-icon>
                        {{ scholarInfo?.author.last_known_institution.display_name }}
                    </span>
                    <div class="infoDataDiv">
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">
                                <n-icon>
                                    <TextQuote16Filled />
                                </n-icon>
                                被引次数
                            </span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo?.author.cited_by_count }}
                            </span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">
                                <n-icon>
                                    <Document16Filled />
                                </n-icon>
                                成果数
                            </span>

                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo?.author.works_count }}
                            </span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">
                                <n-icon>
                                    <Eye16Filled />
                                </n-icon>
                                被关注数
                            </span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">1.3W</span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">
                                <n-icon>
                                    <ArrowTrending16Filled />
                                </n-icon>
                                h指数
                            </span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo?.author.h_index }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="informationDiv">
            <div class="leftInsfDiv">
                <div class="infoChartDiv">
                    <span class="titleSpan">
                        <n-icon class="titleIcon">
                            <DataPie20Filled />
                        </n-icon>
                        数据统计
                    </span>
                    <n-skeleton v-if="loading" width="100%" style="margin-top: 5px;" height="220px" :sharp="false" />
                    <div v-else class="chartDiv">
                        <Chart class="pieChart" type="pie" :data="paperDataByType" />
                        <Chart class="lineChart" type="bar" :data="paperDataByYear" :options="chartOptions" />
                    </div>
                </div>
                <div class="papersDiv">
                    <span class="titleSpan">
                        <n-icon class="titleIcon">
                            <DocumentBulletListMultiple20Filled />
                        </n-icon>
                        文献统计</span>
                    <div class="filterDI">
                        <n-select class="selectStyle" v-model:value="yearFilter" size="small" :options="yearFilterOption" />
                        <n-select class="selectStyle" v-model:value="typeFilter" size="small" :options="typeFilterOption" />
                        <n-select class="selectStyle" v-model:value="cityOrTimeFilter" size="small"
                            :options="cityOrTimeFilterOption" />
                    </div>
                    <n-skeleton v-if="loading" width="100%" style="margin-top: 5px;" height="220px" :sharp="false" />
                    <div class="paperListDiv" v-else v-for="i in scholarInfo?.papers">
                        <ResultCard :result="i" />
                        <div class="horizontalSplitDiv" />
                    </div>
                </div>
            </div>
            <div class="coScholarListDiv">
                <span class="titleSpan">
                    <n-icon class="titleIcon">
                        <PeopleCommunity20Filled />
                    </n-icon>
                    合著学者</span>
                <n-skeleton v-if="loading" width="100%" :sharp="false" height="100px" style="margin-top: 10px;" />
                <div v-else v-for="(sch, index) in  scholarInfo?.co_authors " :key="index" class="coScholarDiv">
                    <n-avatar round :size="48" style="margin: 5px;" class="schoAva"
                        src="https://x0.ifengimg.com/res/2020/79AF4AE1EC8333953CBE4B3B3D0529A6E1FB6186_size217_w1080_h1171.jpeg" />
                    <div class="verticalSplitDiv" />
                    <div class="coScholarInfoDiv">
                        <n-ellipsis style="max-width: calc(100%);">
                            <router-link class="coScholarName" :to="{
                                path: '/scholarHome',
                                query: {
                                    author_name: sch.display_name,
                                    author_id: sch.id
                                }
                            }">
                                {{ sch.display_name }}
                            </router-link>
                        </n-ellipsis>
                        <n-ellipsis style="max-width: 100%; margin-bottom: 5px; display: block; color:var(--text-100)"
                            :tooltip="false">
                            {{ sch.last_known_institution_display_name }}
                        </n-ellipsis>
                        <div class="horizontalSplitDiv" style="width: calc(100%);" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import ResultCard from '@/components/search/ResultCard.vue'
import { get } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { Author, CoAuthor, Paper } from '@/models/model'
import {
    BuildingHome20Filled, TextQuote16Filled, ArrowTrending16Filled, Eye16Filled, Document16Filled,
    DataPie20Filled, PeopleCommunity20Filled, DocumentBulletListMultiple20Filled
} from '@vicons/fluent'
import emitter from '@/eventBus/eventBus';
const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting)
        emitter.emit("titleChange", "");
    else
        emitter.emit("titleChange", scholarName.value);
}, {
    rootMargin: "-70px"
});
const message = useMessage();
const route = useRoute();
const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
    barThickness: 20,
    borderRadius: 3
};
const transLabelName = new Map<string, string>([
    ["article", "文章"],
    ["book-chapter", "书籍章节"],
    ["dissertation", "论文"],
    ["book", "书籍"],
    ["dataset", "数据"],
    ["report", "报告"],
    ["erratum", "勘误表"],
    ["other", "其他"],
    ["reference-entry", "引用条目"],
    ["editorial", "社论"],
    ["paratext", "副文本"],
    ["letter", "信"],
    ["peer-review", "同行评审"],
    ["standard", "标准"],
    ["book-series", "书记系列"],
    ["grant", "授权"]
]);
const paperDataByType: Ref<{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}> = ref({
    labels: [],
    datasets: []
});
const paperDataByYear: Ref<{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}> = ref({
    labels: [],
    datasets: []
});
const scholarName = ref(route.query.author_name);
const scholarID = ref(route.query.author_id);
let scholarInfo: Ref<{ author: Author, papers: Paper[], co_authors: CoAuthor[] } | undefined> = ref();
const loading = ref(true);

const yearFilterOption = ref([{
    label: "全部年份",
    value: "全部年份"
}]);
const yearFilter = ref("全部年份");

const typeFilterOption = ref([{
    label: "全部类型",
    value: "全部类型"
}]);
const typeFilter = ref("全部类型");

const cityOrTimeFilterOption = ref([{
    label: "按年份降序",
    value: "按年份降序"
}, {
    label: "按引用降序",
    value: "按引用降序"
}]);
const cityOrTimeFilter = ref("按年份降序");

import { onMounted, onUnmounted } from 'vue';

onMounted(async () => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }
    io.observe(document.getElementById("authorName")!);
    const data = await get(message, "/author", { "author_id": route.query.author_id });
    if (data) {
        scholarInfo.value = data;
        const typeMap = new Map<string, number>();
        const dateMap = new Map<number, number>();
        const newPapers = scholarInfo.value?.papers.sort((a, b) => {
            return new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime()
        });
        newPapers?.slice(newPapers?.length - 20, undefined).forEach((paper) => {
            const name = transLabelName.get(paper.type) ?? '';
            typeMap.set(name, (typeMap.get(name) ?? 0) + 1);
            const year = new Date(paper.publication_date).getFullYear();
            dateMap.set(year, (dateMap.get(year) ?? 0) + 1);
        });
        var typeVals: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        } = {
            label: '数量',
            data: [],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
            borderWidth: 1
        };
        typeMap.forEach((val, key) => {
            paperDataByType.value.labels.push(key);
            typeVals.data.push(val);
        });
        paperDataByType.value.datasets.push(typeVals);
        var yearVals: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        } = {
            label: '文章数量',
            data: [],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--primary-100')],
            borderColor: [getComputedStyle(document.documentElement).getPropertyValue('--primary-100')],
            borderWidth: 1
        }
        let maxVal = 0;
        dateMap.forEach((val, key) => {
            paperDataByYear.value.labels.push(key.toString());
            yearVals.data.push(val);
            maxVal = Math.max(maxVal, val);
        });
        chartOptions.scales.y.suggestedMax = maxVal + 1;
        paperDataByYear.value.datasets.push(yearVals);
        loading.value = false;
    }

});
onUnmounted(() => {
    window.removeEventListener('popstate', back, false);
    emitter.emit("titleChange", "");
    io.disconnect();
})
function back() {
    console.log("back");
    let doc = document as any;
    let pro = new Promise((re, rj) => {
        let r = router as any;
        r["re"] = re;
        setTimeout(() => {
            rj(123);
        }, 1000);
    });
    doc.startViewTransition(async () => {
        await pro;
    })
    router.back();
}
</script>
<style scoped>
.verticalSplitDiv {
    width: 1px;
    height: 50%;
    background-color: var(--bg-300);
    align-self: center;
}

.titleSpan {
    font-size: larger;
    display: flex;
    align-items: center;
    color: var(--text-100)
}

.titleIcon {
    color: var(--primary-100);
    margin-right: 5px;
}

.horizontalSplitDiv {
    width: 95%;
    height: 1px;
    background-color: var(--bg-300);
    align-self: center;

}

.rootDiv {
    width: 100%;
    min-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.scholarDivBorder {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-100);
}

.scholarDiv {
    width: calc(100% - 64px);
    align-self: end;
    height: 240px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    background-color: var(--bg-100);
    view-transition-name: scholarDiv;
}

.imageDiv {
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: 100px;
    padding: 30px;
}


.infoDiv {
    width: calc(100% - 160px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;

}

.nameDiv {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.nameSpan {
    width: min-content;
    min-width: fit-content;
    font-size: 22pt;
    font-weight: bold;
    color: var(--text-100);
    view-transition-name: scholarName;
    position: sticky;

}

.idSpan {
    width: min-content;
    min-width: fit-content;
    justify-self: right;
    view-transition-name: scholarID;
    background-color: var(--bg-200);
    color: var(--text-100);
    border: 1px solid #E6E6E6;
    margin-right: 200px;
    padding-left: 10px;
    padding-right: 10px;
}

.briefInfo {
    height: 30px;
    font-size: medium;
    display: flex;
    color: var(--primary-100);
}

.claimButton {
    margin-top: 10px;
}

.infoDataDiv {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: start;
    align-items: center;
}

.infoDataBoxDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
}

.infoBoxTitleSpan {
    font-weight: lighter;
    color: var(--primary-100);
    display: flex;
    align-items: center;
}

.infoBoxValueSpan {
    height: 25px;
    color: var(--text-100);
}

.chartDiv {
    width: 100%;
    height: 240px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.pieChart {
    width: 30%;
}

.lineChart {
    width: 60%;
    height: fit-content;
}

.informationDiv {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 20px;
}

.leftInsfDiv {
    display: flex;
    flex-direction: column;
}

.infoChartDiv {
    width: 750px;
    height: fit-content;
    background-color: var(--bg-100);
    padding: 30px;
    border-radius: 10px;

}

.papersDiv {
    width: 750px;
    margin-top: 40px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-100);
    padding: 30px;
    border-radius: 10px;
}

.paperListDiv {
    display: flex;
    flex-direction: column;
}

.paperListDiv>.resultCardContainer {
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: none;

    /* &::after {
        content: "";
        background-color: var(--bg-300);
        height: 1px;
        width: 100%;
        margin-top: 5px;
    } */
}

.filterDI {
    display: flex;

}

.selectStyle {
    width: 150px;
    margin: 10px;
}

.coScholarListDiv {
    width: calc(90% - 700px);
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 30px;
    background-color: var(--bg-100);
    margin-left: 10px;
    border-radius: 10px;
}

.coScholarDiv {
    width: calc(100%);
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: start;
}

.schoAva {
    min-width: 48px;
}

.coScholarInfoDiv {
    margin: 5px;
    width: calc(100% - 48px);
}

.coScholarName {
    font-size: medium;
    color: var(--primary-100);
    text-decoration: none;
    display: block;
}
</style>