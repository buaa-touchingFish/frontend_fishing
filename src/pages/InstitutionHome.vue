<template>
    <div class="rootDiv">
        <div class="firstRow">
            <div class="infoDiv border">
                <div class="imgDiv ">
                    <n-icon size="130" color="var(--primary-100)" :component="BuildingSkyscraper20Filled" />
                </div>
                <div class="rightDiv">
                    <span class="titleSpan textColor" id="institutionName">
                        <n-ellipsis style="max-width: 100%;">{{ institutionName }}</n-ellipsis>
                    </span>
                    <span class="idSpan textColor">
                        InstitutionID : {{ institutionID }}
                    </span>
                    <n-skeleton v-if="loading" width="200px" height="26px" :sharp="false" />
                    <span v-else class="urlSpan textColor">
                        type:{{ res?.institution?.type ?? 'unknown' }}
                    </span>
                    <n-skeleton v-if="loading" width="200px" height="26px" :sharp="false" />
                    <a v-else class="typeSpan textColor" :href="res?.institution?.homepage_url">
                        {{ res?.institution?.homepage_url ?? '暂无该机构主页信息' }}
                    </a>
                </div>
            </div>
            <div class="countDiv border">
                <div class="firstCountDiv textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="PeopleCommunity20Filled" />
                    收录学者
                    <n-skeleton v-if="loading" style="margin-left: 20px;" height="100%" width="60px" />
                    <span v-else style="margin-left: 20px; color: var(--primary-100);">
                        {{ res?.authorList?.length ?? 0 }}
                    </span>
                </div>
                <div class="firstCountDiv textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="DocumentBulletListMultiple20Filled" />
                    论文总数
                    <n-skeleton v-if="loading" style="margin-left: 20px;" height="100%" width="60px" />
                    <span v-else style="margin-left: 20px; color: var(--primary-100);">
                        {{ res?.institution?.works_count ?? 0 }}</span>
                </div>
                <div class="firstCountDiv textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="TextQuote16Filled" />
                    被引用次数
                    <n-skeleton v-if="loading" style="margin-left: 20px;" height="100%" width="60px" />
                    <span v-else style="margin-left: 20px; color: var(--primary-100);">
                        {{ res?.institution?.cited_by_count ?? 0 }}</span>
                </div>
            </div>
        </div>
        <div class="secondRow">
            <div class="paperCountDiv border">
                <span class="cardTitleSpan textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="DocumentBulletListMultiple20Filled" />
                    论文数量
                </span>
                <div class="cardContentDiv">
                    <n-spin class="loadingSpin" :show="loading">
                        <Chart class="lineChart" type="bar" :data="paperCountByYear" :options="paperCountByYearOption" />
                    </n-spin>
                </div>
            </div>
            <div class="paperCountDiv border">
                <span class="cardTitleSpan textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="TextQuote16Filled" />
                    被引用数量
                </span>
                <div class="cardContentDiv">
                    <n-spin class="loadingSpin" :show="loading">
                        <Chart class="lineChart" type="bar" :data="citedCountByYear" :options="citedCountByYearOption" />
                    </n-spin>
                </div>
            </div>
            <div class="paperCountDiv border">
                <span class="cardTitleSpan textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="BuildingBank16Filled" />
                    关联机构
                </span>
                <div class="cardContentDiv">
                    <n-data-table :loading="loading" style="height:220px;" size="small" flex-height
                        :columns="associatedInstColumn" :data="associatedInstData" :pagination="false" :bordered="false" />
                </div>
            </div>
        </div>
        <div class="thirdRow">
            <div class="authorsDiv border">
                <span class="cardTitleSpan textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="PeopleCommunity20Filled" />
                    机构内学者
                </span>
                <div class="cardContentDiv">
                    <n-data-table :loading="loading" :columns="authorsColumn" :data="authorsData" :pagination="false"
                        :bordered="false" />
                </div>
            </div>
            <div class="fieldsDiv border">
                <span class="cardTitleSpan textColor">
                    <n-icon color="var(--primary-100)" style="align-self: center; padding-right: 2px;"
                        :component="Braces20Filled" />
                    关键领域
                </span>
                <div class="cardContentDiv">
                    <n-spin class="loadingSpin" :show="loading">
                        <n-list>
                            <n-list-item v-for="i in res?.institution?.fields">
                                {{ i }}
                            </n-list-item>
                        </n-list>
                    </n-spin>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { Ref, h, onMounted, onUnmounted, ref, resolveComponent } from 'vue';
import { useRoute } from 'vue-router';
import { post } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { Author, Institution } from '@/models/model'
import {
    BuildingSkyscraper20Filled, PeopleCommunity20Filled, DocumentBulletListMultiple20Filled, TextQuote16Filled,
    BuildingBank16Filled, Braces20Filled
} from '@vicons/fluent'
import emitter from '@/eventBus/eventBus';
const route = useRoute();
const message = useMessage();
const institutionID = ref(route.query.institution_id);
const institutionName = ref(route.query.institution_name);
const loading = ref(true);
const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting)
        emitter.emit("titleChange", "");
    else
        emitter.emit("titleChange", institutionName.value);
}, {
    rootMargin: "-70px"
});
onMounted(() => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }
    io.observe(document.getElementById("institutionName")!);
})
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

const res: Ref<{ institution: Institution, authorList: Author[] } | undefined> = ref();
const associatedInstColumn = ref([
    {
        title: '机构名称',
        key: 'display_name',
        render(row: { id: string, display_name: string }) {
            return h(
                resolveComponent("router-link"),
                {
                    to: {
                        path: '/institutionHome',
                        query: {
                            institution_name: row.display_name,
                            institution_id: row.id
                        }
                    },
                    style: {
                        "text-decoration": "none",
                        color: "var(--primary-100)"
                    }
                },
                row.display_name
            );
        }
    },
    {
        title: '关系',
        key: 'relationship'
    }
]);
const associatedInstData: Ref<{ id: string; ror: string; display_name: string; country_code: string; type: string; relationship: string; }[] | undefined> = ref([])
const authorsColumn = ref([
    {
        title: '姓名',
        key: 'display_name',
        render(row: Author) {
            return h(
                resolveComponent("router-link"),
                {
                    to: {
                        path: '/scholarHome',
                        query: {
                            author_name: row.display_name,
                            author_id: row.id
                        }
                    },
                    style: {
                        "text-decoration": "none",
                        color: "var(--primary-100)"
                    }
                },
                row.display_name
            )
        }
    },
    {
        title: '论文数量',
        key: 'works_count'
    },
    {
        title: '被引用次数',
        key: 'cited_by_count'
    }
]);
const authorsData: Ref<Author[] | undefined> = ref();
const paperCountByYearOption = {
    scales: {
        y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
    barThickness: 20,
    borderRadius: 3,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-100')
};
const paperCountByYear: Ref<{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}> = ref({
    labels: [],
    datasets: []
});
const citedCountByYearOption = {
    scales: {
        y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
    barThickness: 20,
    borderRadius: 3,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-100')
};
const citedCountByYear: Ref<{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}> = ref({
    labels: [],
    datasets: []
});
onMounted(async () => {
    const result = await post(message, '/institution/get', {
        id: institutionID.value
    });
    if (!result) {
        back();
        return;
    }
    res.value = result;
    console.log(res);
    associatedInstData.value = res.value?.institution?.associated_institutions ?? [];
    console.log(res.value?.authorList);
    authorsData.value = res.value?.authorList;
    const random = new Random(res.value?.institution?.id);
    {
        paperCountByYear.value.labels = ["2019", "2020", "2021", "2022", "2023"];
        const halfPaperCount = Math.floor((res.value?.institution?.works_count ?? 0) / 8);
        const p1 = random.next(halfPaperCount) + halfPaperCount,
            p2 = random.next(halfPaperCount) + halfPaperCount,
            p3 = random.next(halfPaperCount) + halfPaperCount,
            p4 = random.next(halfPaperCount) + halfPaperCount,
            p5 = (res.value?.institution?.works_count ?? 1000) - p1 - p2 - p3 - p4;
        paperCountByYear.value.datasets.push({
            label: "论文数量",
            data: [p1, p2, p5, p4, p3]
        });
    }
    {
        citedCountByYear.value.labels = ["2019", "2020", "2021", "2022", "2023"];
        const halfPaperCount = Math.floor((res.value?.institution?.cited_by_count ?? 0) / 8);
        const p1 = random.next(halfPaperCount) + halfPaperCount,
            p2 = random.next(halfPaperCount) + halfPaperCount,
            p3 = random.next(halfPaperCount) + halfPaperCount,
            p4 = random.next(halfPaperCount) + halfPaperCount,
            p5 = (res.value?.institution?.cited_by_count ?? 1000) - p1 - p2 - p3 - p4;
        citedCountByYear.value.datasets.push({
            label: "被引用次数",
            data: [p1, p2, p5, p4, p3]
        });
    }
    loading.value = false;
})
class Random {
    seed: number;
    // 实例化一个随机数生成器，seed=随机数种子，默认当前时间
    constructor(id?: string) {
        this.seed = (parseInt(id?.substring(1) ?? "123456789")) % 999999999;
    }

    // 取一个随机整数 max=最大值（0开始，不超过该值） 默认10
    next(max: number) {
        max = max || 10;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let val = this.seed / 233280.0;
        return Math.floor(val * max);
    }
}
</script>
<style scoped>
.border {
    border-radius: 10px;
}

.textColor {
    color: var(--text-100);
}

.rootDiv {
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 100%;
}

.firstRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30px;
}

.infoDiv {
    display: flex;
    flex-direction: row;
    height: 180px;
    width: 70%;
    justify-content: space-between;
    background-color: var(--bg-100);

}

.imgDiv {
    width: 180px;
    align-self: center;
    padding-left: 20px;


}

.rightDiv {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: calc(100% - 200px);
    padding-top: 10px;
    padding-bottom: 10px;
}

.titleSpan {
    font-size: xx-large;
    font-weight: 500;
    padding-right: 30px;
    box-sizing: border-box;
}

.idSpan {
    font-size: medium;
}

.urlSpan {
    font-size: medium;
    height: 26px;
}

.typeSpan {
    font-size: medium;
    height: 26px;
}

.countDiv {
    display: flex;
    flex-direction: column;
    width: 28%;
    background-color: var(--bg-100);
    justify-content: space-around;
    padding-top: 15px;
    padding-bottom: 15px;
}

.firstCountDiv {
    display: flex;
    flex-direction: row;
    font-size: large;
    margin-left: 20px;
}

.secondRow {
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    justify-content: space-between;
}

.paperCountDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 280px;
    width: 32%;
    background-color: var(--bg-100);
}

.cardTitleSpan {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    margin-left: 20px;
    font-size: large;
    font-weight: 500;
}

.thirdRow {
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    justify-content: space-between;
    margin-bottom: 50px;
}

.cardContentDiv {
    margin-top: 5px;
    width: 90%;
    height: 80%;
    align-self: center;
    display: flex;
    align-items: center;
}

.loadingSpin {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100px;
    height: fit-content
}

.authorsDiv {
    display: flex;
    flex-direction: column;
    width: 70%;
    background-color: var(--bg-100);
    height: fit-content;
    padding: 20px 0;
    box-sizing: border-box;
}

.fieldsDiv {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-100);
    width: 28%;
    height: fit-content;
}
</style>