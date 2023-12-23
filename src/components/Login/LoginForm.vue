<template>
    <div class="login-form-container">
        <n-form ref="loginFormRef" :model="loginModel" :rules="loginRules" :style="loginFormStyle" label-width="100px"
            label-placement="left">
            <n-form-item path="name" label="用户名">
                <n-input v-model:value="loginModel.name" @keydown.enter.prevent placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="loginModel.password" type="password" @keydown.enter.prevent placeholder="请输入密码" />
            </n-form-item>

            <div class="login-form-bottom">
                <n-button round type="primary" @click="login" style="width: 85%;">
                    登录
                </n-button>
            </div>
            <div class="form-bottom">
                <n-button type="primary" @click="switchRegister"  style="margin-left: 10%; width: 40%;">
                    注册
                </n-button>
                <n-button @click="switchForget"  style="width: 40%;">
                    找回密码
                </n-button>
            </div>
        </n-form>

        <n-form ref="registerFormRef" :model="registerModel" :rules="registerRules" :style="registerFormStyle"
            label-width="100px" label-placement="left">
            <n-form-item path="username" label="用户名">
                <n-input v-model:value="registerModel.username" @keydown.enter.prevent placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item path="email" label="邮箱">
                <n-input v-model:value="registerModel.email" @keydown.enter.prevent placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="registerModel.password" type="password" @keydown.enter.prevent
                    placeholder="请输入密码" />
            </n-form-item>
            <n-form-item path="repeatPassword" label="确认密码">
                <n-input v-model:value="registerModel.repeatPassword" type="password" @keydown.enter.prevent
                    placeholder="请输入密码" />
            </n-form-item>
            <n-form-item path="captcha" label="验证码">
                <div class="input-with-button">
                    <n-input v-model:value="registerModel.captcha" @keydown.enter.prevent placeholder="请输入验证码" />
                    <n-button type="primary" :disabled="isRegisterButtonDisabled" @click="submitRegisterCaptcha"
                        style="width: 100px;">
                        {{ registerButtonText }}
                    </n-button>
                </div>
            </n-form-item>

            <div class="form-bottom">
                <n-button type="primary" @click="register" style="width: 40%;">
                    注册
                </n-button>
                <n-button @click="switchLogin" style="width: 40%;">
                    去登录
                </n-button>
            </div>
        </n-form>

        <n-form ref="frogetFormRef" :model="forgetModel" :rules="forgetRules" :style="forgetFormStyle" label-width="100px"
            label-placement="left">
            <n-form-item path="email" label="邮箱">
                <n-input v-model:value="forgetModel.email" @keydown.enter.prevent placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="forgetModel.password" type="password" @keydown.enter.prevent placeholder="请输入密码" />
            </n-form-item>
            <n-form-item path="repeatPassword" label="确认密码">
                <n-input v-model:value="forgetModel.repeatPassword" type="password" @keydown.enter.prevent
                    placeholder="请输入密码" />
            </n-form-item>
            <n-form-item path="captcha" label="验证码">
                <div class="input-with-button">
                    <n-input v-model:value="forgetModel.captcha" @keydown.enter.prevent placeholder="请输入验证码" />
                    <n-button type="primary" :disabled="isForgetButtonDisabled" @click="submitForgetCaptcha"
                        style="width: 130px;">
                        {{ forgetButtonText }}
                    </n-button>
                </div>
            </n-form-item>

            <div class="form-bottom">
                <n-button type="primary" @click="forget" class="leftButton">
                    找回
                </n-button>
                <n-button @click="switchLogin" class="rightButton">
                    去登录
                </n-button>
            </div>
        </n-form>

    </div>
</template>
  
<style>
.login-form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    animation: loginAnimation 1s;
    animation-fill-mode: forwards;
    animation-timing-function: ease;
}

::-webkit-scrollbar {
    display: none;
}

.login-form-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 5%;
    width: 110%;
}

.form-bottom {
    display: flex;
    flex-direction: row;
    margin-top: 5%;
    justify-content: space-between;
    width: 100%;

    .leftButton {
        margin-left: 10%;
        width: 40%;
    }

    .rightButton {
        width: 40%;
    }
}

.input-with-button {
    display: flex;
    align-items: center;
    width: 100%;
}

.links {
    display: flex;
    margin: 5px;
    margin-top: 5%;
    justify-content: space-around;

}

.links span {
    padding: 5px 10px;
    border-radius: 5px;
}

.links span:hover {
    color: white;
    background-color: rgb(69, 184, 255);
}

@keyframes loginAnimation {
    0% {
        transform: translate(0, 100px);
    }

    100% {
        transform: translate(0, 0px);
    }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, useMessage, FormRules } from 'naive-ui'
import { post } from '@/api/axios'
import router from '@/router';
import { useAxiosStore } from '@/store/axiosStore';
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia';

interface LoginModelType {
    name: string | null
    password: string | null
}

interface RegisterModelType {
    username: string | null
    email: string | null
    password: string | null
    repeatPassword: string | null
    captcha: string | null
}

interface ForgetModelType {
    email: string | null
    password: string | null
    repeatPassword: string | null
    captcha: string | null
}

const loginFormRef = ref<FormInst | null>(null)
const registerFormRef = ref<FormInst | null>(null)
const frogetFormRef = ref<FormInst | null>(null)
const loginFormStyle = ref({
    'z-index': '1',
    'opacity': '1',
    'width': '80%',
    'height': '100%',
    'transform': 'null',
    'transition': '0.5s'
});

const registerFormStyle = ref({
    'z-index': '0',
    'opacity': '0',
    'width': '80%',
    'height': '0',
    'transform': 'null',
    'transition': '0.5s'
})

const forgetFormStyle = ref({
    'z-index': '0',
    'opacity': '0',
    'width': '80%',
    'height': '0',
    'transform': 'null',
    'transition': '0.5s'
})

const showStyle = {
    'z-index': '1',
    'opacity': '1',
    'width': '80%',
    'height': '100%',
    'transform': 'translate(0, 0px)',
    'transition': '0.5s'
}

const hideStyle = {
    'z-index': '0',
    'opacity': '0',
    'width': '80%',
    'height': '0',
    'transform': 'null',
    'transition': '0.5s'
}

const switchRegister = () => {
    loginFormStyle.value = hideStyle
    forgetFormStyle.value = hideStyle
    setTimeout(() => {
        registerFormStyle.value = showStyle
    }, 500)
}

const switchLogin = () => {
    forgetFormStyle.value = hideStyle
    registerFormStyle.value = hideStyle
    setTimeout(() => {
        loginFormStyle.value = showStyle
    }, 500)
}

const switchForget = () => {
    loginFormStyle.value = hideStyle
    registerFormStyle.value = hideStyle
    setTimeout(() => {
        forgetFormStyle.value = showStyle
    }, 500)
}
const message = useMessage()
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const loginModel = ref<LoginModelType>({
    name: null,
    password: null,
})
const registerModel = ref<RegisterModelType>({
    username: null,
    email: null,
    password: null,
    repeatPassword: null,
    captcha: null
})
const forgetModel = ref<ForgetModelType>({
    email: null,
    password: null,
    repeatPassword: null,
    captcha: null
})
const loginRules: FormRules = {
    name: [
        {
            required: true,
            message: '请输入用户名',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
}
const registerRules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
        },
    ],
    email: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入邮箱')
                } else if (!emailPattern.test(value)) {
                    return new Error('请输入正确格式的邮箱')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
    repeatPassword: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入密码')
                } else if (value !== registerModel.value.password) {
                    return new Error('两次密码输入不一致！')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    captcha: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入验证码')
                } else if (value.length !== 5) {
                    return new Error('请输入正确格式验证码')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
}
const forgetRules: FormRules = {
    email: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入邮箱')
                } else if (!emailPattern.test(value)) {
                    return new Error('请输入正确格式的邮箱')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
    repeatPassword: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入密码')
                } else if (value !== forgetModel.value.password) {
                    return new Error('两次密码输入不一致！')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    captcha: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入验证码')
                } else if (value.length !== 5) {
                    return new Error('请输入正确格式验证码')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
}
const userStore = useUserStore();
const userstore = storeToRefs(userStore);
const axiosStore = useAxiosStore();
const login = (e: MouseEvent) => {
    e.preventDefault()
    loginFormRef.value?.validate(async (errors) => {
        if (!errors) {
            let res = await post(message, "/user/login", {
                "username": loginModel.value.name,
                "password": loginModel.value.password,
            })
            if (res === false) {
                return;
            }

            const token = res.jwt
            // TODO:加token和userstore保存信息
            axiosStore.updateAuthorizationHeader(token)
            userstore.curUser = res.uid
            localStorage.setItem('token', token)
            localStorage.setItem('uid', res.uid)
            if (res.uid <= 20) {
                router.push('/admin')
            } else {
                router.push('/')
            }

        } else {
            message.warning("请完善信息")
        }
    })
}

const isRegisterButtonDisabled = ref(false);
const registerButtonText = ref('发送验证码');
const registerCountdown = ref(60);

const submitRegisterCaptcha = async () => {
    if (emailPattern.test(registerModel.value.email ? registerModel.value.email : '')) {
        if (!isRegisterButtonDisabled.value) {
            isRegisterButtonDisabled.value = true;
            registerCountdown.value = 60;
            registerButtonText.value = `${registerCountdown.value} 秒后可重试`;

            const intervalId = setInterval(() => {
                registerCountdown.value--;
                registerButtonText.value = `${registerCountdown.value} 秒后可重试`;

                if (registerCountdown.value === 0) {
                    clearInterval(intervalId);
                    isRegisterButtonDisabled.value = false;
                    registerButtonText.value = '发送验证码';
                }
            }, 1000);
        }
        let email = registerModel.value.email
        let res = await post(message, "/user/sendCaptcha", {
            email: email
        })
        if (!res) {
            return;
        }
    } else {
        message.warning('请填写邮箱')
    }
};

const register = (e: MouseEvent) => {
    e.preventDefault()
    registerFormRef.value?.validate(async (errors) => {
        if (!errors) {
            let res = await post(message, '/user/register', {
                "username": registerModel.value.username,
                "password": registerModel.value.password,
                "email": registerModel.value.email,
                "captcha": registerModel.value.captcha,
            })
            if (res === false) {
                return
            }
            forgetFormStyle.value = hideStyle
            registerFormStyle.value = hideStyle
            setTimeout(() => {
                loginFormStyle.value = showStyle
            }, 500)
        }
    })
}

const isForgetButtonDisabled = ref(false);
const forgetButtonText = ref('发送验证码');
const forgetCountdown = ref(60);

const submitForgetCaptcha = async () => {
    if (emailPattern.test(forgetModel.value.email ? forgetModel.value.email : '')) {
        if (!isForgetButtonDisabled.value) {
            isForgetButtonDisabled.value = true;
            forgetCountdown.value = 60;
            forgetButtonText.value = `${forgetCountdown.value} 秒后可重试`;

            const intervalId = setInterval(() => {
                forgetCountdown.value--;
                forgetButtonText.value = `${forgetCountdown.value} 秒后可重试`;

                if (forgetCountdown.value === 0) {
                    clearInterval(intervalId);
                    isForgetButtonDisabled.value = false;
                    forgetButtonText.value = '发送验证码';
                }
            }, 1000);
        }
        let res = await post(message, "/user/findpwd", {
            email: forgetModel.value.email
        })
        if (res === false) {
            return
        }
    } else {
        message.error('请先填写邮箱')
    }

};

const forget = (e: MouseEvent) => {
    e.preventDefault()
    frogetFormRef.value?.validate(async (errors) => {
        if (!errors) {
            let res = await post(message, "/user/changepwd", {
                "email": forgetModel.value.email,
                "captcha": forgetModel.value.captcha,
                "new_pwd": forgetModel.value.password,
            })
            if (res === false) {
                return
            }
            forgetFormStyle.value = hideStyle
            registerFormStyle.value = hideStyle
            setTimeout(() => {
                loginFormStyle.value = showStyle
            }, 500)
        }
    })
}

</script>


  