<template>
    <div class="resultCardContainer shadow" :style="{viewTransitionName: 'resultCardDiv'+result.id}" @click="gotoDetail">
        <h1 class="title hoverTitle" :data-title="copyResult.title">
            <span class="ellipsis" v-html="result.title"></span>
        </h1>
        <div class="authors">
            <div class="author" :data-title="copyResult.authorships[index].author.display_name"
                v-for="(authorship, index) in result.authorships" :key="index" v-show="index < 5">
                <span class="ellipsis" v-html="authorship.author.display_name" @click.stop="$router.push(
                    {
                        path: '/scholarHome',
                        query: {
                            author_name: copyResult.authorships[index].author.display_name,
                            author_id: copyResult.authorships[index].author.id,
                            paper_id: copyResult.id
                        }
                    })"></span>
                <div v-show="index != 4 && index != result.authorships.length - 1">,&nbsp;&nbsp;</div>
            </div>
        </div>
        <div class="publish_time_and_cited_by_count">
            <div class="publish_time">
                {{ result.publication_date }}
            </div>
            <div class="publisher" :data-title="copyResult.publisher?.display_name"
                v-show="copyResult.publisher && copyResult.publisher.display_name != '暂无' && copyResult.publisher.display_name != null">
                <span class="ellipsis" v-html="result.publisher?.display_name"></span>
            </div>
            <div class="cited_by_count">
                被引量：{{ result.cited_by_count }}
            </div>
        </div>
        <div class="abstract" v-html="result.abstract"></div>
        <div class="cardBottom">
            <div class="option">
                <n-button strong secondary round type="info" class="optionButton" @click.stop="collect(true)" v-if="!isCollected">
                    <n-icon :size="18" :component="Star20Regular" /><span>收藏</span>
                </n-button>
                <n-button strong secondary round type="info" class="optionButton" @click.stop="collect(false)" v-if="isCollected">
                    <n-icon :size="18" :component="Star20Filled" /><span>已收藏</span>
                </n-button>
                <n-button strong secondary round type="info" class="optionButton" @click.stop="changeQuoteMask"><n-icon :size="18"
                        :component="AlignLeft16Regular" /><span>引用</span></n-button>
                <n-button strong secondary round type="info" class="optionButton" @click.stop="download"><n-icon :size="18"
                        :component="ArrowDownload16Regular" /><span>资源获取</span></n-button>
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
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, nextTick } from 'vue';
import { Paper } from '@/models/model'
import { Star20Regular, Star20Filled, AlignLeft16Regular, ArrowDownload16Regular } from '@vicons/fluent'
import { useRoute } from 'vue-router'
import { post } from '@/api/axios'
import { useMessage } from 'naive-ui'
import router from '@/router';
import Clipboard from 'clipboard'

const props = defineProps<{
    result: Paper
}>()
const route = useRoute()
const message = useMessage()

const result: Ref<Paper> = ref(props.result)
const copyResult: Ref<Paper> = ref(props.result)

onMounted(() => {
    isClicked.value = false
    result.value = props.result
    result.value.abstract = result.value.abstract.length >= 150 ? result.value.abstract.substring(0, 150) + "..." : result.value.abstract
    copyResult.value = JSON.parse(JSON.stringify(props.result))
})

nextTick(() => {
    const query = route.query;
    const replaceString = '<em style="color: var(--primary-100);font-weight: 600;">$&</em>'
    if (query.keyword) {
        const replaceReg = new RegExp(query.keyword as string, 'gi')
        result.value.title = result.value.title.replace(replaceReg, replaceString)
        result.value.abstract = result.value.abstract.replace(replaceReg, replaceString)
    }
    if (query.author) {
        const replaceReg = new RegExp(query.author as string, 'gi')
        result.value.authorships.forEach((item) => {
            item.author.display_name = item.author.display_name.replace(replaceReg, replaceString)
        })
    }
    if (query.publisher) {
        const replaceReg = new RegExp(query.publisher as string, 'gi')
        result.value.publisher.display_name = result.value.publisher.display_name.replace(replaceReg, replaceString)
    }
})

const gotoDetail = async () => {
    isClicked.value = true
    await post(message, '/history/create', { 'paper_id': result.value.id });
    router.push('/detail/' + result.value.id);
}

//收藏引用等
const isCollected = ref(false)
const collect = async (coll:boolean) => {
    if(coll){
        const res = await post(message,'/collect',{paper_id:result.value.id})
        isCollected.value = true
    }else{
        const res = await post(message,'/collect/delete',{paper_id:[result.value.id]})
        isCollected.value = false
    }    
}
//引用
const quoteMask = ref(false)
const citation: Ref<string> = ref("")
const changeQuoteMask = async () => {
    const res = await post(
        message, "/paper/getcitation",
        {
            "id": result.value.id
        }
    )
    citation.value = res
    quoteMask.value = !quoteMask.value
}
function copy() {
    const clipboard = new Clipboard('.copyCiteButton');
    clipboard.on('success', () => {
        clipboard.destroy()
        alert("复制成功！");
    })
}
//下载
const download = async () => {
    const res = await post(message,'/paper/geturl',{id:result.value.id})
    if(res == 'no' || res == ''){
        message.warning('暂无该论文全文数据')
    }else{
        window.open(res,"_blank")
    }
}
//动画
const isClicked = ref(false)

</script>

<style scoped>
.shadow {
    box-shadow: 0 0 5px 3px var(--shadow);
}

.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.hoverTitle[data-title] {
    position: relative;
    width: fit-content;
    max-width: 100%;

    &:hover:after {
        opacity: 1;
        transition: all 0.1s ease 0.5s;
        visibility: visible;
    }

    &:after {
        content: attr(data-title);
        background-color: var(--bg-200);
        height: fit-content;
        font-size: 12px;
        position: absolute;
        padding: 4px 10px;
        right: 20px;
        top: -1.5rem;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 99999;
        visibility: hidden;
        opacity: 0;
    }
}

.resultCardContainer {
    width: 95%;
    margin-bottom: 15px;
    padding: 7px 20px 13px 25px;
    background-color: var(--bg-100);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: 0.2s all linear;

    &:first-child {
        margin-top: 15px;
    }

    &:hover {
        box-shadow: 0 0 10px #ccc;
        background-color: var(--card-cover);
        transition: 0.2s all linear;
    }
}
.title {
    width: 100%;
    height: 50px;
    margin: 0;
    padding: 0 10px 0 0;
    font-size: 20px;
    font-weight: 400;
    display: flex;
    align-items: center;
    color: var(--text-100);

    cursor: pointer;
    /* view-transition-name: searchResultCardTitle; */
}

.authors {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
}

.author {
    display: flex;
    color: var(--text-100);
    overflow: hidden;

    & span:hover {
        color: var(--primary-100);
        text-decoration: underline;
    }
}

.author[data-title] {
    position: relative;
    width: fit-content;
    max-width: 100%;
    padding-top: 20px;
    margin-top: -20px;
    padding-right: 60px;
    margin-right: -60px;

    &:hover:after {
        opacity: 1;
        transition: all 0.1s ease 0.5s;
        visibility: visible;
    }

    &:after {
        content: attr(data-title);
        background-color: var(--bg-200);
        height: fit-content;
        font-size: 12px;
        position: absolute;
        padding: 4px 10px;
        left: 20px;
        top: 0;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 99999;
        visibility: hidden;
        opacity: 0;
    }
}

.publish_time_and_cited_by_count {
    font-size: 13px;
    color: var(--text-200);
    display: flex;
}

.publisher {
    width: 30%;
    margin-left: 10%;
    font-weight: 600;
    color: var(--text-200);

    & span {
        display: block;
        width: 100%;

        /* &:hover {
            color: var(--primary-200);
            text-decoration: underline;
        } */
    }
}

.publisher[data-title] {
    position: relative;
    width: fit-content;
    max-width: 30%;

    &:hover:after {
        opacity: 1;
        transition: all 0.1s ease 0.5s;
        visibility: visible;
    }

    &:after {
        content: attr(data-title);
        background-color: var(--bg-200);
        height: fit-content;
        font-size: 12px;
        position: absolute;
        padding: 4px 10px;
        right: 20px;
        top: -1.5rem;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 99999;
        visibility: hidden;
        opacity: 0;
    }
}

.cited_by_count {
    margin-left: 10%;
}

.abstract {
    text-wrap: wrap;
    color: var(--text-200);
    font-size: 13px;
    line-height: 26px;
}

.cardBottom {
    width: 100%;
    height: 50px;
    display: flex;
}

.otherInfo {
    width: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.option {
    width: 50%;
    margin-top: 5px;
    display: flex;
    align-items: center;
}

.optionButton {
    margin-right: 7px;
    height: 30px;
    display: flex;
    align-items: center;

    & span {
        height: 18px;
        line-height: 18px;
        margin-left: 3px;
    }
}
.modalButton {
    float: right;
    margin-top: 10px;
}
.search-text {
    color: var(--primary-100);
}
</style>
