<template>
    <div class="detailContainer">
        <n-card :title=fileDetail.title>
            <n-grid :x-gap="12" :y-gap="8" :cols="36">
                <n-grid-item :span="2" class="constFont">作者:</n-grid-item>
                <n-grid-item :span="34">
                    <n-space :size="[12, 0]">
                        <span v-for="(authorship, index) in fileDetail.authorships" :key=index>
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
                <n-button type="info">收藏</n-button>
                <n-button type="info" class="button" @click="changeQuoteMask">引用</n-button>
                <n-button type="info" class="button" @click="changeShowCommentInput">评论</n-button>
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
            <n-card class="comments" :segmented="{content: true}">
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

            <n-card class="statistics" :segmented="{footer: 'soft'}">
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
                {{citeContent}}
            </n-card>
            <n-button tertiary type="info" class="copyCiteButton" @click="copy" data-clipboard-target="#foo">复制</n-button>
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

const message = useMessage()
const route = useRoute()

const fileDetail:Ref<Paper> = ref({
    id:"",
    title:"",
    publication_date:"",
    authorships:[
        {
            author:{
                id: "",
                display_name: ""
            },
            institutions:[]
        },
    ],
    abstract:"",
    keywords:[],
    cited_by_count:203,
    oa_url: "",
    doi: "",
    type: "",
    publisher: {
        id: "",
        display_name: ""
    },
    referenced_works: [],
    related_works: [],
    lan: "",
    issn: "",
    is_active: false,
    browse: 0,
    good: 0,
    collect: 0
})
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
    content:string
}

const similarPapers:Ref<paperItemType[]> = ref([])
const quotePapers:Ref<paperItemType[]> = ref([])
const comments:Ref<commentType[]> = ref([])
onMounted(async () => {
    const paperId = route.params.id
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
    comments.value = res
    console.log(comments.value)
})

const quoteMask = ref(false)
function changeQuoteMask(){
    quoteMask.value = !quoteMask.value
}

const citeContent = ref("[1]刘炜.48例肝内门静脉癌栓的超声诊断价值的探讨[J].中国医药指南, 2013, 11(32):2.DOI:CNKI:SUN:YYXK.0.2013-32-381.")

const newComment = ref("")
const ifShowCommentInput = ref(false)
function changeShowCommentInput(){
    ifShowCommentInput.value = !ifShowCommentInput.value
}

function copy() {
    const clipboard = new Clipboard('.copyCiteButton');
    clipboard.on('success', () => {
        clipboard.destroy()
        alert("复制成功！");
    })
}

function publishComment() {
    const res = post(
        message,"/comment",
        {
            "content":newComment.value,
            "paper_id":fileDetail.value.id,
            "sender_id":localStorage.getItem("uid"),
        }
    )
    console.log(res)
    
    async () => {
        const newComments =  await get(
            message,"/comment",
            {
                "paper_id":fileDetail.value.id
            }
        )
        comments.value = newComments
        console.log(comments.value)
    }
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
.button{
    margin-left: 20px;
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
.copyCiteButton{
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
</style>