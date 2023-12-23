<template>
    <n-modal v-model:show="userInfoModal" class="custom-card" preset="card" style="width: 25vw;height: 60vh;"
        title="个人信息" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%;">
        <div class="info">
            <div class="infoContentFirst">
                <div class="infoAvatar">
                    <n-upload ref="avatarUpload" abstract :custom-request="chooseAvatar"
                        :default-file-list="fileList">
                        <n-upload-trigger #="{ handleClick }" abstract>
                            <div class="infoAvatarContainer" @click="handleClick">
                                <n-avatar round :size="45" :src="currentAvatar" />
                                <div class="changeAvatar">
                                    <n-icon color="white" :size="30" :component="Camera20Filled" />
                                </div>
                            </div>
                        </n-upload-trigger>
                    </n-upload>
                </div>
                <div class="infoContent">
                    <span>用户名</span>
                    <span v-if="!showChangeInput[0]">{{ userName }}</span>
                    <n-input v-else v-model:value="changeForm[0]" type="text" placeholder="请输入新用户名"></n-input>
                </div>
            </div>
            <div class="operations">
                <n-button v-if="!showChangeInput[0]" text type="primary"
                    @click="showChangeInput[0] = !showChangeInput[0]">
                    修改
                </n-button>
                <template v-else>
                    <n-button text type="primary" @click="changeInfo(0)" style="margin-right: 10%;">
                        保存
                    </n-button>
                    <n-button text type="default" @click="showChangeInput[0] = !showChangeInput[0]">
                        取消
                    </n-button>
                </template>
            </div>
        </div>
        <div class="info">
            <div class="infoContent">
                <span>手机号</span>
                <span v-if="!showChangeInput[1]">{{ phone }}</span>
                <n-input v-else v-model:value="changeForm[1]" type="text" placeholder="请输入手机号"></n-input>
            </div>
            <div class="operations">
                <n-button v-if="!showChangeInput[1]" text type="primary"
                    @click="showChangeInput[1] = !showChangeInput[1]">
                    修改
                </n-button>
                <template v-else>
                    <n-button text type="primary" @click="changeInfo(1)" style="margin-right: 10%;">
                        保存
                    </n-button>
                    <n-button text type="default" @click="showChangeInput[1] = !showChangeInput[1]">
                        取消
                    </n-button>
                </template>
            </div>
        </div>
        <div class="info">
            <div class="infoContent">
                <span>邮箱</span>
                <span>{{ email }}</span>
            </div>
        </div>
        <div class="changePassword">
            <n-button text type="primary" style="margin-right: 10%;"
                @click="changePasswordModal = !changePasswordModal">
                修改密码
            </n-button>
        </div>
    </n-modal>
    <n-modal v-model:show="changeAvatarModal" preset="card" style="width: 30vw;height: 70vh;">
        <div style="width: 100%; height: 90%;">
            <vueCropper ref="cropper" :img="imgbase" centerBox="true" autoCrop="true" outputSize="1"
                outputType="png" fixedNumber="1" fixedBox="true" autoCropWidth="200" autoCropHeight="200"
                limitMinSize="50">
            </vueCropper>
        </div>
        <div class="changeAvatarButtons">
            <n-button strong secondary type="primary" style="margin-top: 20px;width: 20%;" @click="changeAvatar">
                确定
            </n-button>
            <n-button strong secondary type="default" style="margin-top: 20px;width: 20%;"
                @click="changeAvatarModal = !changeAvatarModal;">
                取消
            </n-button>
        </div>
    </n-modal>
    <!-- 修改密码 -->
    <n-modal title="修改密码" v-model:show="changePasswordModal" preset="card" style="width: 30vw;height: 40vh;">
        <n-form ref="changePasswordForm" :model="changePasswordModel" :rules="changePasswordRules">
            <n-form-item path="oldPassword" label="旧密码">
                <n-input v-model:value="changePasswordModel.oldPassword" @keydown.enter.prevent
                    placeholder="请输入旧密码" />
            </n-form-item>
            <n-form-item path="newPassword" label="新密码">
                <n-input v-model:value="changePasswordModel.newPassword" @keydown.enter.prevent
                    placeholder="请输入新密码" />
            </n-form-item>
        </n-form>
        <div class="submitButtons">
            <n-button type="info" class="submitButton" @click="changePassword">
                确定
            </n-button>
            <n-button type="default" class="submitButton" @click="changePasswordModal = !changePasswordModal">
                取消
            </n-button>
        </div>
    </n-modal>
</template>

<script setup lang='ts'>
import { watch,ref } from 'vue';
import { post,postWithParam } from '@/api/axios'
import { NIcon, NButton, NAvatar, useMessage, UploadCustomRequestOptions } from 'naive-ui'
import { Camera20Filled } from '@vicons/fluent'

const message = useMessage()
const props = defineProps<{
    userInfoModal:boolean
}>()
const emit = defineEmits(['close'])

watch(() => props.userInfoModal,() => {
    userInfoModal.value = props.userInfoModal
})

//个人信息
const currentAvatar = ref('');
const userInfoModal = ref(false)
watch(userInfoModal,(newValue) => {
    if(!newValue)
        emit('close',newValue)
})
const userName = ref('');
const phone = ref('');
const email = ref('');
const changeForm = ref(['', '', '']);
const showChangeInput = ref([false, false, false]);
const changeInfo = async (index: number) => {
    //表单验证
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const phonePattern = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    if (!phonePattern.test(changeForm.value[1])) {
        message.warning('请输入正确格式的手机号');
        showChangeInput.value[1] = !showChangeInput.value[1];
        changeForm.value[1] = phone.value;
        return;
    }
    if (!emailPattern.test(changeForm.value[2])) {
        message.warning('请输入正确格式的邮箱');
        showChangeInput.value[2] = !showChangeInput.value[2];
        changeForm.value[2] = email.value;
        return;
    }
    const res = await post(message, '/user/changeInfo', {
        "username": changeForm.value[0],
        "phone": changeForm.value[1],
        "email": changeForm.value[2]
    });
    if (!res) {
        return;
    }
    userName.value = changeForm.value[0];
    phone.value = changeForm.value[1];
    email.value = changeForm.value[2];
    showChangeInput.value[index] = !showChangeInput.value[index];
    message.success('修改成功！');
}
//修改头像
const changeAvatarModal = ref(false)
const imgbase = ref('');
const fileList = ref([]);
const avatarUpload = ref();
const cropper = ref();
const chooseAvatar = ({
    file
}: UploadCustomRequestOptions) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.file as File);
    reader.onload = function () {
        imgbase.value = reader.result as string;
    }
    avatarUpload.value.clear();
    changeAvatarModal.value = !changeAvatarModal.value;
}
const changeAvatar = () => {
    cropper.value.getCropBlob(async (data: Blob) => {
        const formData = new FormData();
        formData.append('key', `用户${localStorage.getItem('uid')}在${Date.now()}修改的头像`);
        formData.append('file', data as File);
        const res = await postWithParam(message,'/user/upload', formData, {headers: { 'Content-Type': 'multipart/form-data' },})
        currentAvatar.value = res.data;
    })
    changeAvatarModal.value = !changeAvatarModal.value;
}

//修改密码
const changePasswordModal = ref(false);
const changePasswordModel = ref({ oldPassword: '', newPassword: '' });
const changePasswordRules = {
    oldPassword: [
        { required: true, message: '请输入旧密码' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码' }
    ]
}
const changePassword = async () => {
    const res = await post(
        message,
        '/user/changePwd',
        {
            "oldPassword": changePasswordModel.value.oldPassword,
            "newPassword": changePasswordModel.value.newPassword,
        });
    if (!res) {
        return;
    }
    message.success('修改成功！')
    changePasswordModal.value = false;
}
</script>

<style scoped>
.info {
    height: 33%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info::before {
    content: '';
    width: 80%;
    height: 2px;
    background-color: #eeee;
    position: absolute;
    left: 10%;
    margin-bottom: 30%;
}

.info:first-child::before {
    width: 100%;
    left: 0;
}

.infoContentFirst {
    height: 100%;
    width: 80%;
    display: flex;
    align-items: center;

    .infoContent {
        padding-left: 10px;
    }
}

.infoAvatar {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .infoAvatarContainer {
        font-size: 0;
        border-radius: 50%;
        position: relative;

        .changeAvatar {
            height: 45px;
            width: 45px;
            background-color: rgba(0, 0, 0, 0.46);
            font-size: 0;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
        }

        &:hover .changeAvatar {
            cursor: pointer;
            opacity: 1;
            transition: .3s linear;
        }
    }
}

.infoContent {
    height: 60%;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    >span:first-child {
        font-size: 17px;
        color: rgb(96, 90, 131)
    }
}

.operations {
    height: 100%;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.changeAvatarButtons {
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.changePassword {
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    bottom: 1%;
}

.submitButtons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    .submitButton {
        width: 40%;
    }
}
</style>
