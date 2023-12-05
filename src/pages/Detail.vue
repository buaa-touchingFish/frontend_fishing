<template>
    <div class="detailContainer">
        <n-card :title=fileDetail.title>
            <div>
                <span class="constFont">作者：</span>
                <span v-for="(author, index) in fileDetail.authors" :key=index>
                    {{ author }}
                    <span></span>
                </span>
            </div>

            <div class="abstractContainer">
                <div class="constFont">摘要：</div>
                <div class="abstractContent">
                    {{ fileDetail.abstract }}
                </div>
            </div>

            <div>
                <span class="constFont">关键词：</span>
                <span v-for="(word, index) in fileDetail.keywords" :key=index>
                    {{ word }}
                    <span></span> 
                </span>
            </div>

            <div>
                <span class="constFont">发布日期：</span>
                <span>{{ fileDetail.date }}</span>
            </div>
            
            <template #footer>
                <n-button type="info">收藏</n-button>
                <n-button type="info" class="button">引用</n-button>
                <n-button type="info" class="button">评论</n-button>
            </template>
        </n-card>
        
        <div class="commentsAndStatistics">
            <n-card title="评论" class="comments" :segmented="{content: true}">
                <Comment v-for="(comment, index) in fileDetail.comments" :key=index :comment=comment></Comment>
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
                        <n-gi>{{fileDetail.readNum}}</n-gi>
                        <n-gi>{{fileDetail.collectNum}}</n-gi>
                        <n-gi>{{fileDetail.quotedNum}}</n-gi>
                        <n-gi >{{fileDetail.commentNum}}</n-gi>
                    </n-grid>
                </template>
            </n-card>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Comment from '@/components/detail/Comment.vue'
type detailType = {
    title:string,
    date:string,
    authors:string[],
    abstract:string,
    keywords:string[],
    collectNum:number,
    quotedNum:number,
    commentNum:number,
    readNum:number,
    comments:commentType[]
}
type commentType = {
    userName:string,
    date:string,
    content:string
}
const fileDetail:detailType = {
    title:"计算机视觉中摄像机定标综述",
    date:"2002-10-10",
    authors:["tom","mary","jack"],
    abstract:"回顾了摄影测量学和计算机视觉中的各种摄像机定标方法,对各种方法进行了分析,比较,并讨论了摄像机定标方法应用于计算机视觉中的特点.目的:探讨超声对肝门静脉癌栓的诊断价值,提高肝癌的诊断率.方法回顾性分析了48例肝内静脉内实质团块患者超声检查资料,重点观察肝癌的部位及门静脉内 部回声,血流特点,并与临床最后证实有肝癌存在的结果进行对比分析.结果48例门静脉癌栓患者,42例经CT,MRI确诊,6例经手术病理证实,诊断符合 率100%.结论二维超声联合CDFI检查肝内门静脉系统癌栓有较高的诊断价值.",
    keywords:["计算机视觉","摄像机定标","摄影测量学","立体视觉","三维重建"],
    collectNum:203,
    quotedNum:54,
    commentNum:14,
    readNum:10000,
    comments:[
        {
            userName:"tom",
            date:"2002-01-01",
            content:"回顾了摄影测量学和计算机视觉中的各种摄像机定标方法,对各种方法进行了分析,比较,并讨论了摄像机定标方法应用于计算机视觉中的特点.目的:探讨超声对肝门静脉癌栓的诊断价值,提高肝癌的诊断率.方法回顾性分析了48例肝内静脉内实质团块患者超声检查资料,重点观察肝癌的部位及门静脉内 部回声,血流特点,并与临床最后证实有肝癌存在的结果进行对比分析.结果48例门静脉癌栓患者,42例经CT,MRI确诊,6例经手术病理证实,诊断符合 率100%.结论二维超声联合CDFI检查肝内门静脉系统癌栓有较高的诊断价值."
        },
        {
            userName:"mary",
            date:"2002-01-01",
            content:"回顾了摄影测量学和计算机视觉中的各种摄像机定标方法,对各种方法进行了分析,比较,并讨论了摄像机定标方法应用于计算机视觉中的特点.目的:探讨超声对肝门静脉癌栓的诊断价值,提高肝癌的诊断率.方法回顾性分析了48例肝内静脉内实质团块患者超声检查资料,重点观察肝癌的部位及门静脉内 部回声,血流特点,并与临床最后证实有肝癌存在的结果进行对比分析.结果48例门静脉癌栓患者,42例经CT,MRI确诊,6例经手术病理证实,诊断符合 率100%.结论二维超声联合CDFI检查肝内门静脉系统癌栓有较高的诊断价值."
        },
        {
            userName:"jack",
            date:"2002-01-01",
            content:"回顾了摄影测量学和计算机视觉中的各种摄像机定标方法,对各种方法进行了分析,比较,并讨论了摄像机定标方法应用于计算机视觉中的特点.目的:探讨超声对肝门静脉癌栓的诊断价值,提高肝癌的诊断率.方法回顾性分析了48例肝内静脉内实质团块患者超声检查资料,重点观察肝癌的部位及门静脉内 部回声,血流特点,并与临床最后证实有肝癌存在的结果进行对比分析.结果48例门静脉癌栓患者,42例经CT,MRI确诊,6例经手术病理证实,诊断符合 率100%.结论二维超声联合CDFI检查肝内门静脉系统癌栓有较高的诊断价值."
        },
    ]
}
</script>

<style scoped>
.detailContainer{
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
.constFont{
    color: gray;
}
.abstractContainer{
    display: flex;
}
.abstractContent{
    width: 95%;
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
</style>