<template>
    <div>
    <n-popover placement="bottom" trigger="hover" :show-arrow="false" style="margin-right: 40px;margin-top: 10px;border-radius: 15px;" @update:show="handleUpdateShow" :animated="false">
      <template #trigger>
        <div class="user">
            <div class="avatar" :class="{enter:isEnter,leave:isLeave}">
                <n-avatar round :size="40" :src="'http://'+currentAvatar" />
            </div>
        </div>
      </template>
      <div class="userInfoContainer">
            <div class="largeAvatar" :class="{appear:isEnter,disappear:isLeave}">
                <n-upload ref="avatarUpload" abstract :custom-request="chooseAvatar"
                    :default-file-list="fileList">
                    <n-upload-trigger #="{ handleClick }" abstract>
                        <div class="infoAvatarContainer" @click="handleClick">
                            <n-avatar round :size="80" :src="'http://'+currentAvatar" />
                            <div class="changeAvatar">
                                <n-icon color="white" :size="30" :component="Camera20Filled" />
                            </div>
                        </div>
                    </n-upload-trigger>
                </n-upload>
            </div>
            <div class="useNameContainer">
                <div class="userName">
                    <span v-if="!showChangeInput[0]">{{ username }}</span>
                    <n-input v-else v-model:value="changeForm[0]" type="text" @blur="changeInfo(0)" @keyup.enter.naive="changeInfo(0)" placeholder="请输入手机号"></n-input>
                    <n-icon class="changeName" :size="22" :component="CalligraphyPen20Regular" v-show="!showChangeInput[0]" @click="showChangeInput[0] = !showChangeInput[0]"/>
                </div>
            </div>
            <div class="subscribe_and_collect">
                <div class="subscribe">
                    <div class="subscribeNumber">{{ subscribeNumber }}</div>
                    <span>订阅</span>
                </div>
                <div class="collect" @click="$router.push('/collect')">
                    <div class="collectNumber">{{ collectNumber }}</div>
                    <span>收藏</span>
                </div>
            </div>
            <div class="email">
                    <span>邮箱</span>
                    <span>{{ email }}</span>
            </div>
            <div class="phone">
                <span>手机号</span>
                <span v-if="!showChangeInput[1]">{{ phone }}</span>
                <n-input v-else v-model:value="changeForm[1]" type="text" @blur="changeInfo(1)" @keyup.enter.naive="changeInfo(1)" placeholder="请输入手机号"></n-input>
                <div class="phoneOperations" v-show="!showChangeInput[1]">
                    <n-button text type="primary" @click="showChangeInput[1] = !showChangeInput[1]">修改</n-button>
                </div>
            </div>
            <div v-if="author_id !== null" class="scholar" @click="$router.push({
                path: '/scholarHome',
                query: {
                    author_name: author_name,
                    author_id: author_id
                }
            });">
                <n-icon color="var(-primary--100)" size="20">
                    <Door16Filled></Door16Filled>
                </n-icon>
                <span>我的学者门户</span>
            </div>
            <div class="operations">
                <n-button round type="info" @click="changePasswordModal = true">
                    修改密码
                </n-button>
                <n-button round type="error" @click="logout">
                    退出登录
                </n-button>
            </div>
        </div>
    </n-popover>

    <n-modal v-model:show="changeAvatarModal" preset="card" style="width: 30vw;height: 70vh;">
        <div style="width: 100%; height: 90%;">
            <VueCropper ref="cropper" :img="imgbase" centerBox="true" autoCrop="true" outputSize="1"
                outputType="png" fixedNumber="1" fixedBox="true" autoCropWidth="200" autoCropHeight="200"
                limitMinSize="50">
            </VueCropper>
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
</div>
</template>

<script setup lang='ts'>
import { onMounted,ref } from 'vue';
import { get,post } from '@/api/axios'
import { NIcon, NButton, NAvatar, useMessage, UploadCustomRequestOptions } from 'naive-ui'
import { Camera20Filled,CalligraphyPen20Regular, Door16Filled } from '@vicons/fluent'
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import router from '@/router';

const message = useMessage()

//控制显示
const isLeave = ref(false)
const isEnter = ref(false)
const handleUpdateShow = (show:boolean) => {
    isLeave.value = !show;
    isEnter.value = show;
}

//个人信息
const currentAvatar = ref('');
const username = ref('');
const phone = ref('');
const email = ref('');
const author_id = ref('')
const author_name = ref('')
const subscribeNumber = ref(0)
const collectNumber = ref(0)
const getInfo = async () => {
    const res = await get(message,'/user/getInfo',{})
    if(!res){
        return;
    }
    username.value = res.username;
    currentAvatar.value = res.avatar;
    email.value = res.email
    phone.value = res.phone
    author_id.value = res.author_id;
    author_name.value = res.author_name;
    changeForm.value[0] = res.username;
    changeForm.value[1] = res.phone;
}
onMounted(async () => {
    await getInfo()
    let res = await get(message,'/subscribe',{uid:localStorage.getItem('uid')})
    subscribeNumber.value = res ? res.length : 0;
    res = await get(message,'/collect',{uid:localStorage.getItem('uid')})
    collectNumber.value = res ? res.length : 0;
})
const changeForm = ref(['', '']);
const showChangeInput = ref([false, false]);
const changeInfo = async (index: number) => {
    //表单验证
    if(index == 1)
    {
        const phonePattern = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
        if (!phonePattern.test(changeForm.value[1])) {
            message.warning('请输入正确格式的手机号');
            showChangeInput.value[1] = !showChangeInput.value[1];
            changeForm.value[1] = phone.value;
            return;
        }
    }else{
        if(changeForm.value[0] == ''){
            message.warning('用户名可不能为空哦');
            showChangeInput.value[0] = false;
            changeForm.value[0] = username.value;
        }
    }
    const res = await post(message, '/user/changeinfo', {
        "username": changeForm.value[0],
        "email": email.value,
        "phone": changeForm.value[1],
        "avatar": currentAvatar.value,
        "uid": localStorage.getItem('uid'),
        "author_id": author_id.value
    });
    if (res != null && !res) {
        return;
    }
    console.log(1);
    
    showChangeInput.value[index] = false;
    await getInfo();
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
        formData.append('file', new File([data],`用户${localStorage.getItem('uid')}在${Date.now()}修改的头像`));
        const res = await post(message,'/user/upload', formData)
        currentAvatar.value = res.data;
        await getInfo()
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
        '/user/changepwd1',
        {
            "oldpwd": changePasswordModel.value.oldPassword,
            "newpwd": changePasswordModel.value.newPassword,
        });
    if (res!=null && !res) {
        return;
    }
    message.success('修改成功！')
    changePasswordModal.value = false;
}

//退出登陆
const logout = () => {
    localStorage.removeItem('uid')
    localStorage.removeItem('token')
    message.success('已退出登录!')
    router.push('/')
}
</script>

<style scoped>
.user {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.avatar{
    height: 100%;
    width: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.enter{
    visibility: hidden;
}
.leave{
    transform-origin: right top;
    animation: shrink 200ms ease-out;
}
@keyframes magnify {
    0%{
        transform: scale(0.5,0.5);
    }
    100%{
        
    }
}
@keyframes shrink {
    0%{
        transform: scale(2,2);
    }
    100%{
        
    }
}
.userInfoContainer{
    height: 300px;
    width: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position:relative;
}
.largeAvatar{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border:1px var(--bg-100) solid;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top:-60px;
    left: calc(50% - 40px);
    cursor: pointer;

    transform-origin: right top;
    animation: magnify 200ms ease-out;
}
.infoAvatarContainer {
    font-size: 0;
    border-radius: 50%;
    position: relative;

    &:hover .changeAvatar {
        cursor: pointer;
        opacity: 1;
        transition: .3s .5s linear;
    }
}
.changeAvatar {
    height: 80px;
    width: 80px;
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
.appear{
    
}
.disappear{
    visibility: hidden;
}
.useNameContainer{
    margin-top: 30px;
    height: 10%;
    font-size: 20px;
    font-weight: 600;
}
.userName{
    display: felx;
    align-items: center;
    position: relative;
}
.changeName{
    transform: rotateZ(45deg) translateY(5px);
    opacity: 0.3;
    font-size: 0;
    cursor: pointer;
    transition: 0.2s all linear;
    position: absolute;
    top: 3px;
    right: -30px;

    &:hover{
        color: var(--primary-100);
        opacity: 1;
        transition: 0.2s all linear;
    }
}
.subscribe_and_collect{
    width: 90%;
    height: 25%;
    display: flex;

}
.subscribe{
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & span{
        font-size: 16px;
    }
}
.subscribeNumber{
    font-size: 23px;
}
.collect{
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    & span{
        font-size: 16px;
    }
}
.collectNumber{
    font-size: 23px;
}
.email {
    height: 20%;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.phone{
    height: 20%;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.scholar {
    height: 20%;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    span {
        margin-left: 10%;
    }
}

.phoneOperations {
    height: 100%;
    width: 15%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.operations{
    width: 90%;
    height: 10%;
    display:flex;
    justify-content:space-between;
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
