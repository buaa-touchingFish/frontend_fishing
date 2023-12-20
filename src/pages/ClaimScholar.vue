<template>
    <div class="rootDiv">
        <span class="titleSpan">正在认证学者:</span>
        <span class="nameSpan">{{ scholarName }}</span>
        <p class="idSpan">scholarID : {{ scholarID }}</p>
        <n-divider></n-divider>
        <div class="formDiv">
            <span class="mailSpan">邮箱</span>
            <n-input type="email" placeholder="请如如实输入邮箱. ig:mail@domain.com"></n-input>
            <span class="mailSpan">验证信息</span>
            <div class="inputDiv">
                <n-button class="sendMailButton">获取验证信息</n-button>
                <n-input type="number" placeholder="请检查邮箱，输入验证信息"></n-input>
            </div>
            <n-button class="submitButton">提交</n-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const scholarName = ref(route.query.author_name);
const scholarID = ref(route.query.author_id);
onMounted(() => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }
});
onUnmounted(() => {
    window.removeEventListener('popstate', back, false);
})
function back() {
    console.log("back");
    let doc = document as any;
    let pro = new Promise((re, _rj) => {
        let r = router as any;
        r["re"] = re;
    });
    doc.startViewTransition(async () => {
        await pro;
    })
    router.back();
}
</script>
<style scoped>
.rootDiv {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: left;
    view-transition-name: horizontalScroll;
}

.titleSpan {
    margin-top: 20px;
    font-size: medium;
}

.nameSpan {
    width: min-content;
    min-width: fit-content;
    font-size: 30pt;
    font-weight: bold;
    view-transition-name: scholarName;
}

.idSpan {
    width: min-content;
    min-width: fit-content;
    font-size: large;
    view-transition-name: scholarID;
}

.formDiv {
    width: 500px;
    height: 300px;
    background-color: aliceblue;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    padding-left: 40px;
    padding-right: 40px;
}

.mailSpan {
    width: 95%;
    margin-top: 15px;
    margin-bottom: 5px;
}

.inputDiv {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
}

.sendMailButton {
    margin-left: 30px;
}

.submitButton {
    margin-top: 50px;
}
</style>