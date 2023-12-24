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
                {{ display_date }}
                {{ display_time }}
            </n-space>
        </div>
    </div>
    <div class="commentContent">
        {{ comment.content }}
    </div>
    <n-divider/>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'

let display_date = ref("")
let display_time = ref("")
onMounted(
    () => {
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth()+1
        const year = date.getFullYear()

        const sends = comment.send_time.split("T")
        const sendDate = sends[0].split("-")
        const sendYear = parseInt(sendDate[0], 10)
        const sendMonth = parseInt(sendDate[1], 10)
        const sendDay = parseInt(sendDate[2], 10)

        if(year == sendYear && month == sendMonth && day == sendDay) display_date.value = "今天"
        else if(year == sendYear && month == sendMonth && day == sendDay + 1) display_date.value = "昨天"
        else if(year == sendYear) display_date.value = sendMonth + "-" + sendDay
        else display_date.value = sends[0]
        
        display_time.value = sends[1]
    }
) 
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