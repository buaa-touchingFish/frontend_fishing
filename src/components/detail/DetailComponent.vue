<template>
    <n-card class="border">
        <template #header>
            <span class="header">
                {{ fileDetail.title }}
            </span>
        </template>
        <n-grid :x-gap="12" :y-gap="8" :cols="24">
            <n-grid-item :span="2" class="constFont">作者:</n-grid-item>
            <n-grid-item :span="22">
                <n-space :size="[16, 0]">
                    <span class="author" v-for="(authorship, index) in fileDetail.authorships" :key=index @click="$router.push(
                        {
                            path: '/scholarHome',
                            query: {
                                author_name: authorship.author.display_name,
                                author_id: authorship.author.id,
                                paper_id: fileDetail.id
                            }
                        }
                    )">
                        {{ authorship.author.display_name }};
                    </span>
                </n-space>
            </n-grid-item>

            <n-grid-item :span="2" class="constFont">摘要:</n-grid-item>
            <n-grid-item :span="22">{{ fileDetail.abstract }}</n-grid-item>

            <n-grid-item :span="2" class="constFont">关键词:</n-grid-item>
            <n-grid-item :span="22" class="keywords">
                <n-space :size="[16, 0]">
                    <span v-for="(word, index) in fileDetail.keywords" :key=index>
                        {{ word }};
                    </span>
                </n-space>
            </n-grid-item>

            <n-grid-item :span="2" class="constFont">时间:</n-grid-item>
            <n-grid-item :span="22">{{ fileDetail.publication_date }}</n-grid-item>
        </n-grid>

        <template #footer>
            <n-popover trigger="hover" v-if="!fileDetail.isCollected">
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="first_button" @click="collect">
                        <Star12Regular />
                    </n-icon>
                </template>
                <span>收藏</span>
            </n-popover>

            <n-popover trigger="hover" v-else>
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="first_button" @click="undoCollect">
                        <Star12Filled />
                    </n-icon>
                </template>
                <span>取消收藏</span>
            </n-popover>

            <n-popover trigger="hover">
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="follow_buton" @click="changeQuoteMask">
                        <TextQuote16Filled />
                    </n-icon>
                </template>
                <span>引用</span>
            </n-popover>

            <n-popover trigger="hover">
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="follow_buton" 
                        @click="
                            ifShowCommentInput = !ifShowCommentInput;
                            nextTick(() => {
                                inputRef.focus()
                            })
                        "
                    >
                        <Comment12Regular />
                    </n-icon>
                </template>
                <span>评论</span>
            </n-popover>

            <n-popover trigger="hover">
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="follow_buton"
                        @click="getPaper"
                    >
                        <LinkSquare12Regular />
                    </n-icon>
                </template>
                <span>获取</span>
            </n-popover>

            <n-popover trigger="hover">
                <template #trigger>
                    <n-icon size="40" color="var(--primary-100)" class="follow_buton" @click="changeAppealMask">
                        <Warning20Filled />
                    </n-icon>
                </template>
                <span>申诉</span>
            </n-popover>

            <div class="newComment" v-show="ifShowCommentInput">
                <n-input 
                    v-model:value="newComment" 
                    placeholder="请输入评论" 
                    type="textarea" 
                    :autosize="{minRows: 2,maxRows: 5}"
                    ref="inputRef"
                />
                <n-button color="#3F51B5" class="newCommentButton" @click="publishComment">发布</n-button>
            </div>
        </template>
    </n-card>

    <div class="commentsAndStatistics">
        <div class="comments">
            <n-card class="border" :segmented="{ content: true }">
                <n-tabs type="line" animated>
                    <n-tab-pane name="评论" tab="评论">
                        <Comment v-for="(comment, index) in comments" :key=index :comment=comment></Comment>
                        <n-empty description="还没有评论哦" v-show="comments.length == 0" size="huge"></n-empty>
                    </n-tab-pane>

                    <n-tab-pane name="相似文献" tab="相似文献">
                        <PaperItem v-for="(paperItem, index) in similarPapers" :key=index :paperItem=paperItem></PaperItem>
                        <n-empty description="无相似文献" v-show="similarPapers.length == 0" size="huge"></n-empty>
                    </n-tab-pane>

                    <n-tab-pane name="引用文献" tab="引用文献">
                        <PaperItem v-for="(paperItem, index) in quotePapers" :key=index :paperItem=paperItem></PaperItem>
                        <n-empty description="无引用文献" v-show="quotePapers.length == 0" size="huge"></n-empty>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </div>
        
        <div class="statistics_chart">
            <n-card class="border" :segmented="{ footer: 'soft' }">
                <n-grid x-gap="12" :cols="4" class="constFont">
                    <n-gi>浏览量</n-gi>
                    <n-gi>收藏量</n-gi>
                    <n-gi>引用量</n-gi>
                    <n-gi>评论量</n-gi>
                </n-grid>
                <template #footer>
                    <n-grid x-gap="12" :cols="4" class="statValueFont">
                        <n-gi>{{ fileDetail.browse }}</n-gi>
                        <n-gi>{{ fileDetail.collect }}</n-gi>
                        <n-gi>{{ fileDetail.cited_by_count }}</n-gi>
                        <n-gi>{{ comments.length }}</n-gi>
                    </n-grid>
                </template>
            </n-card>

            <n-card class="paperCountDiv border">
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
            </n-card>
        </div>
    </div>
    

    <n-modal v-model:show="quoteMask">
        <n-card style="width: 600px" title="引用" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-card embedded id="foo">
                {{ citation }}
            </n-card>
            <n-button tertiary type="info" class="modalButton copyCiteButton" @click="copy"
                data-clipboard-target="#foo">复制</n-button>
        </n-card>
    </n-modal>

    <n-modal v-model:show="appealMask">
        <n-card style="width: 600px" title="申诉" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-input v-model:value="appealContent" type="textarea" placeholder="输入申诉内容" />
            <n-button tertiary type="info" class="modalButton" @click="appeal">申诉</n-button>
        </n-card>
    </n-modal>
</template>

<script setup lang='ts'>
import Comment from '@/components/detail/Comment.vue'
import PaperItem from '@/components/detail/PaperItem.vue'
import { ref, onMounted, Ref, watch, nextTick } from 'vue'
import Clipboard from 'clipboard'
import { post, get } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { Paper } from '@/models/model'
import { Star12Regular, TextQuote16Filled, Comment12Regular, LinkSquare12Regular, ArrowDownload20Filled, Star12Filled, Warning20Filled } from '@vicons/fluent'

const message = useMessage()

const fileDetail: Ref<Paper | any> = ref({})
type paperItemType = {
    title: string,
    abstract: string,
    authors: {
        id: string,
        display_name: string
    }[],
    publication_date: string,
    cited_by_count: number,
    id: string,
    publisher: string
}
type commentType = {
    sender_name: string,
    send_time: string,
    content: string,
    avatar: string
}

const props = defineProps(['paper_id'])
watch(() => props.paper_id, async (newVal) => {
    console.log(newVal)
    let res = await post(
        message, "/paper/single",
        {
            "id": newVal
        }
    )
    console.log(res)
    fileDetail.value = res

    res = await post(
        message, "/paper/iscollect",
        {
            "id": fileDetail.value.id
        }
    )
    console.log(res)
    if(res == undefined) res = false
    fileDetail.value.isCollected = res
    
    res = await post(
        message, "/paper/getRel",
        {
            "rel": fileDetail.value.related_works
        }
    )
    similarPapers.value = res
    console.log(similarPapers.value)

    res = await post(
        message, "/paper/getRef",
        {
            "ref": fileDetail.value.referenced_works
        }
    )
    quotePapers.value = res
    console.log(quotePapers.value)

    res = await get(
        message, "/comment",
        {
            "paper_id": fileDetail.value.id
        }
    )
    console.log(res)
    comments.value = res

    res = await post(
        message, "/paper/getcitation",
        {
            "id": fileDetail.value.id
        }
    )
    console.log(res)
    citation.value = res
})

const loading = ref(true);
const similarPapers: Ref<paperItemType[]> = ref([])
const quotePapers: Ref<paperItemType[]> = ref([])
const comments: Ref<commentType[]> = ref([])
const citation: Ref<string> = ref("")
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
onMounted(async () => {
    const paperId = props.paper_id
    let res = await post(
        message, "/paper/single",
        {
            "id": paperId
        }
    )
    console.log(res)
    fileDetail.value = res

    res = await post(
        message, "/paper/getRel",
        {
            "rel": fileDetail.value.related_works
        }
    )
    similarPapers.value = res
    console.log(similarPapers.value)

    res = await post(
        message, "/paper/getRef",
        {
            "ref": fileDetail.value.referenced_works
        }
    )
    quotePapers.value = res
    console.log(quotePapers.value)

    res = await get(
        message, "/comment",
        {
            "paper_id": fileDetail.value.id
        }
    )
    console.log(res)
    comments.value = res

    res = await post(
        message, "/paper/getcitation",
        {
            "id": fileDetail.value.id
        }
    )
    console.log(res)
    citation.value = res

    res = await post(
        message, "/paper/iscollect",
        {
            "id": fileDetail.value.id
        }
    )
    console.log(res)
    if(res == undefined) res = false
    fileDetail.value.isCollected = res
    
    const random = new Random(fileDetail.value.id);
    citedCountByYear.value.labels = ["2019", "2020", "2021", "2022", "2023"];
    let halfPaperCount = Math.ceil((fileDetail.value.cited_by_count*100 ?? 0) / 8);
    console.log(halfPaperCount)
    const p1 = random.next(halfPaperCount) + halfPaperCount,
        p2 = random.next(halfPaperCount) + halfPaperCount,
        p3 = random.next(halfPaperCount) + halfPaperCount,
        p4 = random.next(halfPaperCount) + halfPaperCount,
        p5 = (fileDetail.value.cited_by_count*100 ?? 1000) - p1 - p2 - p3 - p4;
    citedCountByYear.value.datasets.push({
        label: "被引用次数",
        data: [p1, p2, p5, p4, p3]
    });
    loading.value = false
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

const quoteMask = ref(false)
function changeQuoteMask() {
    quoteMask.value = !quoteMask.value
}
function copy() {
    const clipboard = new Clipboard('.copyCiteButton');
    clipboard.on('success', () => {
        clipboard.destroy()
        message.success('复制成功')
    })
}

const appealMask = ref(false)
function changeAppealMask() {
    appealMask.value = !appealMask.value
}
const appealContent = ref("")
async function appeal() {
    if(appealContent.value.length == 0) {
        message.warning('申诉内容不能为空')
        return
    }
    const res = await post(
        message, "/user/create/appeal",
        {
            "content": appealContent.value,
            "paper_id": fileDetail.value.id
        }
    )
    console.log(res)
    appealMask.value = !appealMask.value
    appealContent.value = ""
    if(res === null) message.success('申诉成功')
    if(res === false) message.warning('已经申诉过了')
}

const inputRef = ref()
const newComment = ref("")
const ifShowCommentInput = ref(false)
async function publishComment() {
    if(newComment.value.length == 0) {
        message.warning('还没输入评论哦')
        return
    }
    let res = await post(
        message, "/comment",
        {
            "content": newComment.value,
            "paper_id": fileDetail.value.id,
            // "sender_id": localStorage.getItem("uid"),
        }
    )
    console.log(res)
    if(res === null) message.success('评论成功')

    res = await get(
        message, "/comment",
        {
            "paper_id": fileDetail.value.id
        }
    )
    console.log(res)
    comments.value = res
    newComment.value = ""
    ifShowCommentInput.value = false
}

const emit = defineEmits(['collectedChange'])
async function collect() {
    const res = await post(
        message, "/collect",
        {
            "paper_id": fileDetail.value.id
        }
    )
    console.log(res)
    if(res === null) {
        fileDetail.value.isCollected = true
        emit("collectedChange", fileDetail.value.id, true)
        message.success('收藏成功')
    }
}
async function undoCollect() {
    const res = await post(
        message, "/collect/delete",
        {
            "paper_id": [fileDetail.value.id]
        }
    )
    console.log(res)
    if(res === null) {
        fileDetail.value.isCollected = false
        emit("collectedChange", fileDetail.value.id, false)
        message.success('取消收藏成功')
    }
}

function getPaper() {
    if(fileDetail.value.oa_url != null && fileDetail.value.oa_url.length != 0) {
        window.open(fileDetail.value.oa_url, '_self')
    } else if(fileDetail.value.doi != null && fileDetail.value.doi.length != 0) {
        window.open(fileDetail.value.doi, '_blank')
    } else {
        message.warning('我们没有该文献的获取途径')
    }
}


</script>

<style scoped>
.header{
    font-weight: 800;
    font-size: 25px;
}
.constFont {
    color: gray;
}

.author{
    font-style: italic;
    color: var(--primary-100);
}
.author:hover {
    cursor: pointer;
    text-decoration: underline;
}

.first_button {
    cursor: pointer;
}

.follow_buton {
    cursor: pointer;
    margin-left: 30px;
}

.commentsAndStatistics {
    display: flex;
    margin-top: 20px;
}

.comments {
    width: 65%;
}
.statistics_chart{
    width: 35%;
    margin-left: 20px;
    text-align: center;
}

.statValueFont {
    color: var(--primary-100);
    font-weight: 1000;
    font-size: large;
}

.modalButton {
    float: right;
    margin-top: 10px;
}

.newComment {
    display: flex;
    margin-top: 10px;
}

.newCommentButton {
    margin-left: 10px;
    height: 55px;
}

.border {
    border-radius: 15px;
}

.keywords{
    font-weight: bold;
}

.paperCountDiv{
    margin-top: 20px;
}

.cardTitleSpan {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    font-size: large;
    font-weight: 500;
}

</style>