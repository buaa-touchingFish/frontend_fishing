<template>
    <div class="detailContainer">
        <n-card :title=fileDetail.title class="border">
            <n-grid :x-gap="12" :y-gap="8" :cols="36">
                <n-grid-item :span="2" class="constFont">作者:</n-grid-item>
                <n-grid-item :span="34">
                    <n-space :size="[12, 0]">
                        <span 
                            class="author"
                            v-for="(authorship, index) in fileDetail.authorships" :key=index
                            @click="$router.push(
                                {
                                    path:'/scholarHome',
                                    query:{
                                        author_name:authorship.author.display_name,
                                        author_id:authorship.author.id
                                    }
                                }
                            )"
                        >
                            {{ authorship.author.display_name }};
                        </span>
                    </n-space>
                </n-grid-item>

                <n-grid-item :span="2" class="constFont">摘要:</n-grid-item>
                <n-grid-item :span="34">{{ fileDetail.abstract }}</n-grid-item>

                <n-grid-item :span="2" class="constFont">关键词:</n-grid-item>
                <n-grid-item :span="34">
                    <n-space :size="[12, 0]">
                        <span v-for="(word, index) in fileDetail.keywords" :key=index>
                            {{ word }};
                        </span>
                    </n-space>
                </n-grid-item>

                <n-grid-item :span="2" class="constFont">时间:</n-grid-item>
                <n-grid-item :span="34">{{ fileDetail.publication_date }}</n-grid-item>
            </n-grid>
            
            <template #footer>
                <n-popover trigger="hover" v-if="!fileDetail.isCollected">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="first_button" @click="collect">
                            <Star12Regular />
                        </n-icon>
                    </template>
                    <span>收藏</span>
                </n-popover>

                <n-popover trigger="hover" v-else>
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="first_button" @click="undoCollect">
                            <Star12Filled />
                        </n-icon>
                    </template>
                    <span>取消收藏</span>
                </n-popover>
                
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="follow_buton"  @click="changeQuoteMask">
                            <TextQuote16Filled />
                        </n-icon>
                    </template>
                    <span>引用</span>
                </n-popover>

                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="follow_buton"  @click="changeShowCommentInput">
                            <Comment12Regular />
                        </n-icon>
                    </template>
                    <span>评论</span>
                </n-popover>

                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="follow_buton" v-show="fileDetail.doi != null && fileDetail.doi.length != 0" @click="link">
                            <LinkSquare12Regular />
                        </n-icon>
                    </template>
                    <span>链接</span>
                </n-popover>
                
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="follow_buton" v-show="fileDetail.oa_url != null && fileDetail.oa_url.length != 0" @click="download">
                            <ArrowDownload20Filled />
                        </n-icon>
                    </template>
                    <span>下载</span>
                </n-popover>

                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon size="40" color="#0000ff" class="follow_buton" @click="changeAppealMask">
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
                        :autosize="{
                            minRows: 2,
                            maxRows: 5
                        }"
                    />
                    <n-button type="info" class="newCommentButton" @click="publishComment">发布</n-button>
                </div>
            </template>
        </n-card>
        
        <div class="commentsAndStatistics">
            <n-card class="comments border" :segmented="{content: true}">
                <n-tabs type="line" animated>
                    <n-tab-pane name="评论" tab="评论">
                        <Comment v-for="(comment, index) in comments" :key=index :comment=comment></Comment>
                        <n-empty description="还没有评论哦" v-show="comments.length == 0"></n-empty>
                    </n-tab-pane>

                    <n-tab-pane name="相似文献" tab="相似文献">
                        <PaperItem v-for="(paperItem, index) in similarPapers" :key=index :paperItem=paperItem></PaperItem>
                        <n-empty description="无相似文献" v-show="similarPapers.length == 0"></n-empty>
                    </n-tab-pane>

                    <n-tab-pane name="引用文献" tab="引用文献">
                        <PaperItem v-for="(paperItem, index) in quotePapers" :key=index :paperItem=paperItem></PaperItem>
                        <n-empty description="无引用文献" v-show="quotePapers.length == 0"></n-empty>
                    </n-tab-pane>
                </n-tabs>
            </n-card>

            <n-card class="statistics border" :segmented="{footer: 'soft'}">
                <n-grid x-gap="12" :cols="4" class="constFont">
                    <n-gi>浏览量</n-gi>
                    <n-gi>收藏量</n-gi>
                    <n-gi>引用量</n-gi>
                    <n-gi>评论量</n-gi>
                </n-grid>
                <template #footer>
                    <n-grid x-gap="12" :cols="4" class="statValueFont">
                        <n-gi>{{fileDetail.browse}}</n-gi>
                        <n-gi>{{fileDetail.collect}}</n-gi>
                        <n-gi>{{fileDetail.cited_by_count}}</n-gi>
                        <n-gi >{{comments.length}}</n-gi>
                    </n-grid>
                </template>
            </n-card>
        </div>
    </div>

    <n-modal v-model:show="quoteMask">
        <n-card
            style="width: 600px"
            title="引用"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-card embedded id="foo">
                {{ citation }}
            </n-card>
            <n-button tertiary type="info" class="modalButton copyCiteButton" @click="copy" data-clipboard-target="#foo">复制</n-button>
        </n-card>
    </n-modal>

    <n-modal v-model:show="appealMask">
        <n-card
            style="width: 600px"
            title="申诉"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-input
                v-model:value="appealContent"
                type="textarea"
                placeholder="输入申诉内容"
            />
            <n-button tertiary type="info" class="modalButton" @click="appeal">申诉</n-button>
        </n-card>
    </n-modal>
</template>

<script setup lang='ts'>
import Comment from '@/components/detail/Comment.vue'
import PaperItem from '@/components/detail/PaperItem.vue'
import { ref, onMounted, Ref } from 'vue'
import Clipboard from 'clipboard'
import { post, get } from '@/api/axios'
import { useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import { Paper } from '@/models/model'
import { Star12Regular, TextQuote16Filled, Comment12Regular, LinkSquare12Regular, ArrowDownload20Filled, Star12Filled, Warning20Filled } from '@vicons/fluent'
import emitter from '@/eventBus/eventBus'

const message = useMessage()
const route = useRoute()

const fileDetail:Ref<Paper | any> = ref({})
type paperItemType = {
    title:string,
    abstract:string,
    authors:{
        id:string,
        display_name:string
    }[],
    publication_date:string,
    cited_by_count:number,
    id:string,
    publisher:string
}
type commentType = {
    sender_name:string,
    send_time:string,
    content:string,
    avatar:string
}

const props = defineProps(['paper_id'])

const similarPapers:Ref<paperItemType[]> = ref([])
const quotePapers:Ref<paperItemType[]> = ref([])
const comments:Ref<commentType[]> = ref([])
const citation:Ref<string> = ref("")
onMounted(async () => {
    const paperId = props.paper_id != undefined ? props.paper_id : route.params.id
    let res = await post(
        message,"/paper/single",
        {
            "id":paperId
        }
    )
    console.log(res)
    fileDetail.value = res
    
    res = await post(
        message,"/paper/getRel",
        {
            "rel":fileDetail.value.related_works
        }
    )
    similarPapers.value = res
    console.log(similarPapers.value)

    res = await post(
        message,"/paper/getRef",
        {
            "ref":fileDetail.value.referenced_works
        }
    )
    quotePapers.value = res
    console.log(quotePapers.value)

    res = await get(
        message,"/comment",
        {
            "paper_id":fileDetail.value.id
        }
    )
    console.log(res)
    comments.value = res

    res = await post(
        message,"/paper/getcitation",
        {
            "id":fileDetail.value.id
        }
    )
    console.log(res)
    citation.value = res
})

const quoteMask = ref(false)
function changeQuoteMask(){
    quoteMask.value = !quoteMask.value
}
function copy() {
    const clipboard = new Clipboard('.copyCiteButton');
    clipboard.on('success', () => {
        clipboard.destroy()
        alert("复制成功！");
    })
}

const appealMask = ref(false)
function changeAppealMask(){
    appealMask.value = !appealMask.value
}
const appealContent = ref("")
async function appeal() {
    const res = await post(
        message,"/user/create/appeal",
        {
            "content":appealContent.value,
            "paper_id":fileDetail.value.id
        }
    )
    console.log(res)
    appealMask.value = !appealMask.value
    appealContent.value = ""
}

const newComment = ref("")
const ifShowCommentInput = ref(false)
function changeShowCommentInput(){
    ifShowCommentInput.value = !ifShowCommentInput.value
}
async function publishComment() {
    await post(
        message,"/comment",
        {
            "content":newComment.value,
            "paper_id":fileDetail.value.id,
            "sender_id":localStorage.getItem("uid"),
        }
    )

    const res = await get(
        message,"/comment",
        {
            "paper_id":fileDetail.value.id
        }
    )
    console.log(res)
    comments.value = res
    newComment.value = ""
    ifShowCommentInput.value = false
}

async function collect() {
    const res = await post(
        message,"/collect",
        {
            "user_id":localStorage.getItem("uid"),
            "paper_id":fileDetail.value.id
        }
    )
    console.log(res)
    fileDetail.value.isCollected = true
    emitter.emit("collectedChange", {paper_id:fileDetail.value.id, status:true})
}
async function undoCollect() {
    const res = await post(
        message,"/collect/delete",
        {
            "user_id":localStorage.getItem("uid"),
            "paper_id":fileDetail.value.id
        }
    )
    console.log(res)
    fileDetail.value.isCollected = false
    emitter.emit("collectedChange", {paper_id:fileDetail.value.id, status:false})
}

function link() {
    window.open(fileDetail.value.doi, '_blank')
}

function download() {
    window.open(fileDetail.value.oa_url, '_self')
}
</script>

<style scoped>
.detailContainer{
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
/* .detailContainer :deep(.n-card-header__main){
    view-transition-name: searchResultCardTitle !important;
} */
.constFont{
    color: gray;
}
.author:hover{
    color: blue;
    cursor: pointer;
    text-decoration: underline;
}
.first_button{
    cursor: pointer;
}
.follow_buton{
    cursor: pointer;
    margin-left: 30px;
}
.commentsAndStatistics{
    display: flex;
    margin-top: 20px;
}
.comments{
    width: 65%;
}
.statistics{
    margin-left: 20px;
    width: 35%;
    text-align: center;
    height: 130px;
}
.statValueFont{
    color: blue;
    font-weight: 1000;
    font-size: large;
}
.modalButton{
    float: right;
    margin-top: 10px;
}
.newComment {
    display: flex;
    margin-top: 10px;
}
.newCommentButton{
    margin-left: 10px;
    height: 55px;
}

.border{
    border-radius: 25px;
}
</style>