<template>
    <div class="rootDiv" id="rootDiv">
        <div class="scholarDivBorder">
            <div class="scholarDiv">
                <div class="imageDiv">
                    <n-avatar round :size="128" :src="avaPath" />
                    <n-button class="claimButton" @click="subClicked">
                        <n-icon size="24">
                            <AlertOff20Filled v-if="subscribed" />
                            <Alert20Regular v-else />
                        </n-icon>
                        {{ subscribed ? "取消" : "" }}订阅
                    </n-button>
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
                    <div class="briefInfoDiv">
                        <div class="briefInfoLeftDiv">
                            <n-skeleton v-if="loading" block :width="146" height="30px" :sharp="false" size="small" />
                            <span v-else class="briefInfo" @click="$router.push({
                                path: '/institutionHome',
                                query: {
                                    institution_id: scholarInfo?.author.last_known_institution.id,
                                    institution_name: scholarInfo?.author.last_known_institution.display_name
                                }
                            })">
                                <n-icon size="22">
                                    <BuildingHome20Filled />
                                </n-icon>
                                {{ scholarInfo?.author.last_known_institution?.display_name }}
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
                        <div class="briefInfoRightDiv">
                            <n-button v-if="!claimed" style="width:fit-content" @click="$router.push({
                                path: '/claimScholar',
                                query: {
                                    author_name: scholarName,
                                    author_id: scholarID
                                }
                            })">
                                我要认证
                            </n-button>
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
                        <n-select class="selectStyle" v-model:value="yearFilter" size="small" :options="yearFilterOption"
                            @update:value="filterChanged" />
                        <n-select class="selectStyle" v-model:value="typeFilter" size="small" :options="typeFilterOption"
                            @update:value="filterChanged" />
                        <n-select class="selectStyle" v-model:value="cityOrTimeFilter" size="small"
                            :options="cityOrTimeFilterOption" @update:value="filterChanged" />
                    </div>
                    <n-skeleton v-if="loading" width="100%" style="margin-top: 5px;" height="220px" :sharp="false" />
                    <div class="paperListDiv" v-else v-for="i in filterPapers" :key="i.id">
                        <ResultCard :result="i" />
                        <div class="horizontalSplitDiv" />
                    </div>
                </div>
            </div>
            <div class="rightDiv">
                <div class="coScholarListDiv">
                    <span class="titleSpan">
                        <n-icon class="titleIcon">
                            <PeopleCommunity20Filled />
                        </n-icon>
                        合著学者</span>
                    <n-skeleton v-if="loading" width="100%" :sharp="false" height="100px" style="margin-top: 10px;" />
                    <div v-else v-for="(sch, index) in  scholarInfo?.co_authors " :key="index" class="coScholarDiv">
                        <n-avatar round :size="48" style="margin: 5px;" class="schoAva"
                            src="http://s5usfv19s.hb-bkt.clouddn.com/OIP-C.jpg" />
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
                <div class="netDiv">
                    <span class="titleSpan">
                        <n-icon class="titleIcon">
                            <PeopleCommunity20Filled />
                        </n-icon>
                        关系网络
                    </span>
                    <div style="height: 300px; width: 300px;align-self: center;" id="echartDiv">
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
import { get, post } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { Author, CoAuthor, Paper } from '@/models/model'
import {
    BuildingHome20Filled, TextQuote16Filled, ArrowTrending16Filled, Eye16Filled, Document16Filled,
    DataPie20Filled, PeopleCommunity20Filled, DocumentBulletListMultiple20Filled, Alert20Regular, AlertOff20Filled
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

const filterPapers: Ref<Paper[] | undefined> = ref();
const scholarName = ref(route.query.author_name);
const scholarID = ref(route.query.author_id);
let scholarInfo: Ref<{ author: Author, papers: Paper[], co_authors: CoAuthor[] } | undefined> = ref();
const loading = ref(true);
const subscribed = ref(false);
const claimed = ref(false);
const avaPath = ref("http://s5usfv19s.hb-bkt.clouddn.com/OIP-C.jpg");
onMounted(async () => {
    const r1 = await get(message, '/author/subscribe', { author_id: scholarID.value });
    if (r1)
        subscribed.value = true;
});
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

function filterChanged() {

    const selectedPapersByYear: Paper[] = [];
    if (yearFilter.value == "全部年份") {
        scholarInfo.value?.papers.forEach((paper) => {
            selectedPapersByYear.push(paper);
        })
    } else {
        scholarInfo.value?.papers.forEach((paper) => {
            const date = new Date(paper.publication_date);
            if (date.getFullYear().toString() == yearFilter.value) {
                console.log(paper);

                selectedPapersByYear.push(paper);
            }
        })
    }
    const selectedPapersByType: Paper[] = [];
    if (typeFilter.value == "全部类型") {
        selectedPapersByYear.forEach(paper => {
            selectedPapersByType.push(paper);
        })
    } else {
        selectedPapersByYear.forEach(paper => {
            const paperType = transLabelName.get(paper.type);
            if (paperType == typeFilter.value) {
                selectedPapersByType.push(paper);
            }
        })
    }
    if (cityOrTimeFilter.value == "按年份降序") {
        selectedPapersByType.sort((a, b) => {
            const dateA = new Date(a.publication_date);
            const dateB = new Date(b.publication_date);
            return dateB.getFullYear() - dateA.getFullYear();
        })
    } else {
        selectedPapersByType.sort((a, b) => {
            return b.cited_by_count - a.cited_by_count;
        });
    }
    filterPapers.value = selectedPapersByType;
    console.log(selectedPapersByType);


}

function subClicked() {
    if (subscribed.value) {
        post(message, '/subscribe/delete', { "author_id": scholarID.value });
    } else {
        post(message, '/subscribe', { "author_id": scholarID.value });
    }
    subscribed.value = !subscribed.value;
}

import { onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
onMounted(async () => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }
    io.observe(document.getElementById("authorName")!);
    const data = await get(message, "/author", { "author_id": route.query.author_id, "paper_id": route.query.paper_id ?? "" });
    if (data) {
        scholarInfo.value = data;
        claimed.value = (scholarInfo.value?.author.claim_uid ?? -1) > 0
        console.log(scholarInfo.value);
        if (claimed.value) {
            console.log(scholarInfo.value?.author.claim_uid)
            avaPath.value = "http://" + await post(message, '/user/getava', { id: scholarInfo.value?.author.claim_uid! });
        }
        {
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
                typeFilterOption.value.push({
                    label: key,
                    value: key
                })
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
                yearFilterOption.value.push({
                    label: key.toString(),
                    value: key.toString()
                })
                paperDataByYear.value.labels.push(key.toString());
                yearVals.data.push(val);
                maxVal = Math.max(maxVal, val);
            });
            chartOptions.scales.y.suggestedMax = maxVal + 1;
            paperDataByYear.value.datasets.push(yearVals);
        }
        filterChanged();
        loading.value = false;
        //绘制关系网络
        const mychart = echarts.init(document.getElementById("echartDiv"));
        mychart.hideLoading();
        const chartData: { nodes: { name: string, symbolSize: number, label: { show: boolean } }[], links: { source: string, target: string }[] } = {
            nodes: [
                // Add more nodes as needed
            ],
            links: [
                // Add more links as needed
            ],
        };
        //添加nodes
        //首先添加自己
        const mapper = new Map<string, number>();
        mapper.set(scholarName.value?.toString() ?? "", 30);
        //然后添加一级关系和二级关系
        for (const item of scholarInfo.value?.co_authors ?? []) {
            mapper.set(item.display_name, 20);
            chartData.links.push({
                source: item.display_name,
                target: scholarName.value?.toString() ?? ""
            });
            const result = await get(message, "/author", { "author_id": item.id }) as { author: Author, papers: Paper[], co_authors: CoAuthor[] };
            if (!result) return;
            result.co_authors.forEach((item1) => {
                console.log(item1);
                if (!mapper.has(item1.display_name))
                    mapper.set(item1.display_name, 10);
                chartData.links.push({
                    source: item.display_name,
                    target: item1.display_name,
                });
            })
        }
        mapper.forEach((val, key) => {
            chartData.nodes.push({
                name: key,
                symbolSize: val,
                label: {
                    show: val > 10
                }
            })
        });
        console.log(chartData);

        // ECharts option for the relationship network
        const option = {
            title: {
                text: '',
            },
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    data: chartData.nodes,
                    links: chartData.links,
                    roam: false,
                    zoom: 2.0
                    // force: {
                    //     repulsion: 300, // Adjust as needed
                    // },
                },
            ],
        };

        // Set the option and render the chart
        mychart.setOption(option);
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

.briefInfoDiv {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}

.briefInfoLeftDiv {
    width: 60%;
}

.briefInfoRightDiv {
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--text-100)
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
    cursor: pointer;
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

.rightDiv {
    display: flex;
    flex-direction: column;
    width: calc(90% - 700px);
}

.coScholarListDiv {
    width: 100%;
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

.netDiv {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 30px;
    background-color: var(--bg-100);
    margin-left: 10px;
    border-radius: 10px;
    margin-top: 30px;
}
</style>