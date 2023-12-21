<template>
    <div class="rootDiv">
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
                        <p class="nameSpan">
                            {{ scholarName }}</p>
                        <span class="idSpan">scholarID :
                            {{ scholarID }}
                        </span>
                    </div>
                    <n-skeleton v-if="loading" block :width="146" height="30px" :sharp="false" size="small" />
                    <span v-else class="briefInfo">
                        {{ scholarInfo.author.last_known_institution.display_name }}
                    </span>
                    <div class="infoDataDiv">
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">被引次数</span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo.author.cited_by_count }}
                            </span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">成果数</span>

                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo.author.works_count }}
                            </span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">被关注数</span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">1.3W</span>
                        </div>
                        <n-divider vertical></n-divider>
                        <div class="infoDataBoxDiv">
                            <span class="infoBoxTitleSpan">h指数</span>
                            <n-skeleton v-if="loading" width="100%" height="25px" :sharp="false" size="small" />
                            <span v-else class="infoBoxValueSpan">
                                {{ scholarInfo.author.h_index }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="horizontalSplitDiv" />
        <div class="paperDiv">
            <div class="paperListDiv">
                <span style="font-size: large;">数据统计</span>
                <n-skeleton v-if="loading" width="100%" style="margin-top: 5px;" height="220px" :sharp="false" />
                <div v-else class="chartDiv">
                    <Chart class="pieChart" type="pie" :data="paperDataByType" />
                    <Chart class="lineChart" type="line" :data="paperDataByYear" />
                </div>
            </div>
            <div class="coScholarListDiv">
                <span style="font-size: large;">合作学者</span>
                <n-skeleton v-if="loading" width="100%" :sharp="false" height="100px" style="margin-top: 10px;" />
                <div v-else v-for="(sch, index) in  scholarInfo.co_authors " :key="index" class="coScholarDiv">
                    <n-avatar round :size="48" style="margin: 5px;" class="schoAva"
                        src="https://x0.ifengimg.com/res/2020/79AF4AE1EC8333953CBE4B3B3D0529A6E1FB6186_size217_w1080_h1171.jpeg" />
                    <div class="verticalSplitDiv" />
                    <div class="coScholarInfoDiv">
                        <n-ellipsis style="max-width: 250px;">
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
                        <n-ellipsis style="max-width: 250px; margin-bottom: 5px; display: block;" tooltip="false">
                            {{ sch.last_known_institution_display_name }}
                        </n-ellipsis>
                        <div class="horizontalSplitDiv" />
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
import { get } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { Author, CoAuthor, Paper } from '@/models/model'
const message = useMessage();
const route = useRoute();
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
let scholarInfo: Ref<{ author: Author, papers: Paper[], co_authors: CoAuthor[] }>;
const loading = ref(true);
import { onMounted, onUnmounted } from 'vue';

onMounted(async () => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }

    const data = await get(message, "/author", { "author_id": route.query.author_id });
    if (data != false) {
        scholarInfo = ref(data);
        const typeMap = new Map<string, number>();
        const dateMap = new Map<number, number>();
        scholarInfo.value.papers.forEach((paper) => {
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
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
            borderWidth: 1
        }
        dateMap.forEach((val, key) => {
            paperDataByYear.value.labels.push(key.toString());
            yearVals.data.push(val);
        });
        paperDataByYear.value.datasets.push(yearVals);
    }
    setTimeout(() => {
        loading.value = false;
    }, 0);

});
onUnmounted(() => {
    window.removeEventListener('popstate', back, false);
})
function back() {
    console.log("back");
    let doc = document as any;
    let pro = new Promise((re, rj) => {
        console.log("promise created");
        let r = router as any;
        r["re"] = re;
        setTimeout(() => {
            rj(123);
        }, 1000);
    });
    doc.startViewTransition(async () => {
        await pro;
        console.log("promise done");
    })
    router.back();
}
</script>
<style scoped>
.verticalSplitDiv {
    width: 1px;
    height: 50%;
    background-color: gainsboro;
    align-self: center;
}

.horizontalSplitDiv {
    width: 95%;
    height: 1px;
    background-color: gainsboro;
    align-self: center;

}

.rootDiv {
    width: 100%;
    min-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.scholarDivBorder {
    width: 100%;
    padding-left: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
}

.scholarDiv {
    width: 100%;
    height: 260px;
    padding-right: 150px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    background-color: white;
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
    view-transition-name: scholarName;
    position: sticky;
}

.idSpan {
    width: min-content;
    min-width: fit-content;
    justify-self: right;
    view-transition-name: scholarID;
    background-color: #fafafa;
    border: 1px solid #E6E6E6;
    padding-left: 10px;
    padding-right: 10px;
}

.briefInfo {
    height: 30px;
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
}

.infoBoxValueSpan {
    height: 25px;
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

.paperDiv {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 20px;
}

.paperListDiv {
    width: calc(90% - 350px);
    height: fit-content;
    background-color: white;
    padding: 30px;
    border-radius: 10px;

}

.coScholarListDiv {
    width: 350px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 20px;
    background-color: white;
    margin-left: 10px;
    border-radius: 10px;
}

.coScholarDiv {
    width: 100%;
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
    width: 100%;
}

.coScholarName {
    font-size: medium;
    color: blue;
    text-decoration: none;
    display: block;
}
</style>