<template>
    <div class="userInfo">
        <n-avatar
            round
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
        <div class="nameAndDate">
            <n-space>
                {{ comment.sender_name }}
                <span class="constFont">
                    发布于
                </span> 
                {{comment.send_time}}
            </n-space>
        </div>
    </div>
    <div class="commentContent">
        {{ comment.content }}
    </div>
    <n-divider/>
</template>

<script setup lang='ts'>
const props = defineProps(['comment'])
type commentType = {
    sender_name:string,
    send_time:string,
    content:string
}
const comment:commentType = props.comment
</script>

<style scoped>
.constFont{
    color: gray;
}
.userInfo{
    display:flex;
}
.nameAndDate{
    margin-left:10px;
    display:flex;
    align-items:center;
}
.commentContent{
    width:90%;
    float:right;
    margin-right:20px;
    margin-bottom:10px;
}
</style>