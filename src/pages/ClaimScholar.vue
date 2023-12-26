<template>
    <div class="rootDiv">
        <n-modal :show="showModal">
            <n-card style="width: 600px" title="模态框" size="huge" :bordered="false" role="dialog" aria-modal="true">
                图片正在上传中
            </n-card>
        </n-modal>
        <div class="titleDiv">
            <span class="titleSpan">正在认证学者:</span>
            <span class="nameSpan">{{ scholarName }}</span>
            <p class="idSpan">scholarID : {{ scholarID }}</p>
        </div>
        <div class="formDiv">
            <span class="mailSpan">邮箱</span>
            <n-input type="text" v-model:value="emailStr" placeholder="请如如实输入邮箱. ig:mail@domain.com"></n-input>
            <span class="mailSpan">验证信息</span>
            <div class="inputDiv">
                <n-button class="sendMailButton" @click="sendEmail">获取验证信息</n-button>
                <n-input type="text" v-model:value="captchaStr" placeholder="请检查邮箱，输入验证信息"></n-input>
            </div>
            <span class="mailSpan">证明信息</span>
            <n-upload ref="uploader" class="uploadImg" :custom-request="customRequest" :default-upload="false" max="1"
                :default-file-list="fileList" list-type="image-card">

            </n-upload>
            <n-button class="submitButton" @click="submitInfo">提交</n-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { Ref, onMounted, onUnmounted, ref } from 'vue';
import { UploadCustomRequestOptions, UploadInst, useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { post } from '@/api/axios';
const message = useMessage();
const route = useRoute();
const scholarName = ref(route.query.author_name);
const scholarID = ref(route.query.author_id);
const fileList = ref();
const emailStr = ref('');
const captchaStr = ref('');
const showModal = ref(false);
const uploader: Ref<UploadInst | null> = ref(null);
async function sendEmail() {
    if (emailStr.value == '')
        return;
    const res = await post(message, '/user/claimcaptcha1', {
        email: emailStr.value
    });
    console.log(res)
    if (res != null && !res) {
        return;
    }
    message.info("验证码已发送，请查收 :-)");
}
const customRequest = async ({
    file,
    onFinish,
    onError
}: UploadCustomRequestOptions) => {
    showModal.value = true;
    const formData = new FormData()
    formData.set("email", emailStr.value);
    formData.set("id", scholarID.value?.toString() ?? "");
    formData.set("captcha", captchaStr.value);
    formData.append("file", file.file as File)
    const res = await post(message, '/user/claimcaptcha2', formData);
    if (res == false) {
        showModal.value = false;
        location.reload();
        onError();
        message.error("认领失败 :-( ");
        return;
    }
    onFinish();
    showModal.value = false;
    message.error("请求已发送，等待管理员审查");
    back();
}
async function submitInfo() {
    if (emailStr.value == '' || captchaStr.value == '') {
        message.error("请检查输入信息");
        return;
    }
    uploader.value?.submit();
}
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
</script>
<style scoped>
.rootDiv {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    view-transition-name: horizontalScroll;
}

.titleDiv {
    width: 80%;
    margin-top: 20px;
    padding: 10px;
    padding-left: 30px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-100);
    view-transition-name: scholarDiv;
}

.titleSpan {
    margin-top: 20px;
    font-size: medium;
    color: var(--text-100)
}

.nameSpan {
    width: min-content;
    min-width: fit-content;
    font-size: 30pt;
    font-weight: bold;
    color: var(--text-100);
    view-transition-name: scholarName;
}

.idSpan {
    width: min-content;
    min-width: fit-content;
    font-size: large;
    color: var(--text-100);
    view-transition-name: scholarID;
}

.formDiv {
    width: 500px;
    height: 390px;
    background-color: var(--bg-100);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 20px;
}

.mailSpan {
    width: 95%;
    margin-top: 15px;
    margin-bottom: 5px;
    color: var(--text-100);
}

.uploadImg {
    align-self: center;
    color: var(--text-100);
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